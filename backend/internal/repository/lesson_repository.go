// Package repository provides data access methods for interacting with the database, abstracting the SQL logic from the business handlers.
package repository

import (
	"database/sql"
	"fmt"

	"github.com/imLaanui/Financeu-platform/backend/internal/models"
)

// LessonRepository provides methods for managing user lesson progress data in the database.
type LessonRepository struct {
	db *sql.DB
}

// NewLessonRepository creates and returns a new LessonRepository instance.
func NewLessonRepository(db *sql.DB) *LessonRepository {
	return &LessonRepository{db: db}
}

// GetUserProgress gets all lesson progress for a user
func (r *LessonRepository) GetUserProgress(userID int) ([]*models.LessonProgress, error) {
	query := `
		SELECT id, user_id, lesson_id, completed, completed_at
		FROM lesson_progress
		WHERE user_id = $1
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("error getting user progress: %w", err)
	}
	defer func() {
		if err := rows.Close(); err != nil {
			fmt.Printf("error closing rows: %v\n", err)
		}
	}()

	var progress []*models.LessonProgress
	for rows.Next() {
		p := &models.LessonProgress{}
		err := rows.Scan(&p.ID, &p.UserID, &p.LessonID, &p.Completed, &p.CompletedAt)
		if err != nil {
			return nil, fmt.Errorf("error scanning progress: %w", err)
		}
		progress = append(progress, p)
	}

	// FIX: Check for any error that occurred during the iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error during lesson progress iteration: %w", err)
	}

	return progress, nil
}

// MarkLessonComplete marks a lesson as completed for a user
func (r *LessonRepository) MarkLessonComplete(userID int, lessonID string) error {
	query := `
		INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
		VALUES ($1, $2, true, CURRENT_TIMESTAMP)
		ON CONFLICT (user_id, lesson_id)
		DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP
	`

	_, err := r.db.Exec(query, userID, lessonID)
	if err != nil {
		return fmt.Errorf("error marking lesson complete: %w", err)
	}

	return nil
}

// GetCompletedCount gets the count of completed lessons for a user
func (r *LessonRepository) GetCompletedCount(userID int) (int, error) {
	query := `
		SELECT COUNT(*)
		FROM lesson_progress
		WHERE user_id = $1 AND completed = true
	`

	var count int
	err := r.db.QueryRow(query, userID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error getting completed count: %w", err)
	}

	return count, nil
}
