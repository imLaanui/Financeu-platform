// File: cmd/server/main.go
package main

import (
	"log"
	"os"
	"os/exec"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/imLaanui/Financeu-platform/backend/internal/database"
	"github.com/imLaanui/Financeu-platform/backend/internal/handlers"
	"github.com/imLaanui/Financeu-platform/backend/internal/middleware"
	"github.com/imLaanui/Financeu-platform/backend/internal/repository"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Run migrations if in dev environment
	if os.Getenv("ENV") == "dev" {
		log.Println("Running migrations...")
		cmd := exec.Command(
			"goose",
			"-dir", "migrations",
			"postgres", os.Getenv("DATABASE_URL"),
			"up",
		)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			log.Fatalf("Failed to run migrations: %v", err)
		}
	}

	// Connect to the database
	db := database.Connect()
	defer db.Close()

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	lessonRepo := repository.NewLessonRepository(db)
	feedbackRepo := repository.NewFeedbackRepository(db)
	resetTokenRepo := repository.NewResetTokenRepository(db)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(userRepo, resetTokenRepo)
	userHandler := handlers.NewUserHandler(userRepo, lessonRepo)
	lessonHandler := handlers.NewLessonHandler(lessonRepo)
	feedbackHandler := handlers.NewFeedbackHandler(feedbackRepo)

	// Get JWT secret for middleware
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key-change-this"
		log.Println("⚠️  Warning: Using default JWT secret. Set JWT_SECRET in .env for production!")
	}

	// Set Gin mode
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize router
	r := gin.Default()

	// CORS middleware
	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:5173"
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{corsOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Cookie"},
		AllowCredentials: true,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes
	api := r.Group("/api")
	{
		// Auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
			auth.POST("/forgot-password", authHandler.ForgotPassword)
			auth.POST("/reset-password", authHandler.ResetPassword)
			auth.GET("/me", middleware.AuthMiddleware(jwtSecret), authHandler.GetCurrentUser)
		}

		// User routes (protected)
		users := api.Group("/users")
		users.Use(middleware.AuthMiddleware(jwtSecret))
		{
			users.GET("/profile", userHandler.GetProfile)
			users.PUT("/membership", userHandler.UpdateMembership)
		}

		// Lesson routes (protected)
		lessons := api.Group("/lessons")
		lessons.Use(middleware.AuthMiddleware(jwtSecret))
		{
			lessons.GET("/", lessonHandler.GetLessons)
			lessons.GET("/progress", lessonHandler.GetProgress)
			lessons.POST("/complete", lessonHandler.CompleteLesson)
		}

		// Feedback routes (public submit, protected admin)
		feedback := api.Group("/feedback")
		{
			feedback.POST("/", feedbackHandler.SubmitFeedback)
			feedback.GET("/admin", feedbackHandler.AdminGetFeedback)
			feedback.DELETE("/admin/:id", feedbackHandler.AdminDeleteFeedback)
		}
	}

	// Set port
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📡 API available at http://localhost:%s/api", port)
	log.Printf("🏥 Health check at http://localhost:%s/health", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
