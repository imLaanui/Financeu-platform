package models

import "time"

type LessonProgress struct {
	ID          int        `json:"id"`
	UserID      int        `json:"userId"`
	LessonID    string     `json:"lessonId"`
	Completed   bool       `json:"completed"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`
}
