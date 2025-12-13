package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/imLaanui/Financeu-platform/backend/internal/database"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	db := database.Connect()
	defer db.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	log.Println("Server running on port", port)
	r.Run(":" + port)
}
