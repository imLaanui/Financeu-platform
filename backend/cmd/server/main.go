package main

import (
	"log"
	"os"
	"os/exec"

	"github.com/gin-gonic/gin"
	"github.com/imLaanui/Financeu-platform/backend/internal/database"
	"github.com/joho/godotenv"
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

	// Set port
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	// Initialize router
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	log.Println("Server running on port", port)
	r.Run(":" + port)
}
