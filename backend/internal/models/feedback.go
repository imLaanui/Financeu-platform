// Package models contains the data structures (structs) used throughout the application, representing database tables or request/response payloads.
package models

import "time"

// Feedback represents a user's submission (e.g., bug report, suggestion) stored in the database.
type Feedback struct {
	ID        int       `json:"id"`
	Name      *string   `json:"name,omitempty"`
	Email     *string   `json:"email,omitempty"`
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}
