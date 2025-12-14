// Package models contains the data structures (structs) used throughout the application, representing database tables or request/response payloads.
package models

import "time"

// User represents a user account record stored in the database.
type User struct {
	ID             int       `json:"id"`
	Email          string    `json:"email"`
	Password       string    `json:"-"`
	Name           string    `json:"name"`
	MembershipTier string    `json:"membershipTier"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// UserResponse is what we send to the client (without password)
type UserResponse struct {
	ID             int       `json:"id"`
	Email          string    `json:"email"`
	Name           string    `json:"name"` // Removed the colon (:) here
	MembershipTier string    `json:"membershipTier"`
	CreatedAt      time.Time `json:"createdAt"`
}

// ToResponse converts a User to UserResponse
func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:             u.ID,
		Email:          u.Email,
		Name:           u.Name,
		MembershipTier: u.MembershipTier,
		CreatedAt:      u.CreatedAt,
	}
}
