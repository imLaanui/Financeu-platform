package models

import "time"

type Feedback struct {
	ID        int       `json:"id"`
	Name      *string   `json:"name,omitempty"`
	Email     *string   `json:"email,omitempty"`
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}
