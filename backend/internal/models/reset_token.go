// Package models contains the data structures (structs) used throughout the application, representing database tables or request/response payloads.
package models

import "time"

// ResetToken represents a record used for the password reset functionality, containing a unique token and its expiration time.
type ResetToken struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
	Used      bool      `json:"used"`
}
