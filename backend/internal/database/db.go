// Package database provides functionality for connecting to and interacting with the application's PostgreSQL database.
package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	// This is a blank import, used specifically to register the PostgreSQL driver
	// with the database/sql package.
	_ "github.com/lib/pq"
)

// Connect establishes a connection to the PostgreSQL database using environment variables
// for configuration and returns the *sql.DB object. It logs and exits the application
// if the connection or a ping attempt fails.
func Connect() *sql.DB {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to open DB:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping DB:", err)
	}

	log.Println("Connected to PostgreSQL")
	return db
}
