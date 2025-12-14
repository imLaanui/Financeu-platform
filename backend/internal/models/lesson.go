// Package models contains the data structures (structs) used throughout the application, representing database tables or request/response payloads.
package models

import "time"

// LessonProgress represents a user's progress on a specific learning lesson, tracking whether it has been completed.
type LessonProgress struct {
	ID          int        `json:"id"`
	UserID      int        `json:"userId"`
	LessonID    string     `json:"lessonId"`
	Completed   bool       `json:"completed"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`
}
