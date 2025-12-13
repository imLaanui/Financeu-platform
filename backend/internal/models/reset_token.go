package models

import "time"

type ResetToken struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
	Used      bool      `json:"used"`
}
