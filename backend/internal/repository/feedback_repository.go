// Package repository provides data access methods for interacting with the database, abstracting the SQL logic from the business handlers.
package repository

import (
	"database/sql"
	"fmt"

	"github.com/imLaanui/Financeu-platform/backend/internal/models"
)

// FeedbackRepository provides methods for managing feedback data in the database.
type FeedbackRepository struct {
	db *sql.DB
}

// NewFeedbackRepository creates and returns a new FeedbackRepository instance.
func NewFeedbackRepository(db *sql.DB) *FeedbackRepository {
	return &FeedbackRepository{db: db}
}

// Create creates new feedback
func (r *FeedbackRepository) Create(name, email *string, feedbackType, message string) (int, error) {
	query := `
		INSERT INTO feedback (name, email, type, message)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`

	var id int
	err := r.db.QueryRow(query, name, email, feedbackType, message).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("error creating feedback: %w", err)
	}

	return id, nil
}

// GetAll gets all feedback entries
func (r *FeedbackRepository) GetAll() ([]*models.Feedback, error) {
	query := `
		SELECT id, name, email, type, message, created_at
		FROM feedback
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error getting feedback: %w", err)
	}
	defer func() {
		if err := rows.Close(); err != nil {
			fmt.Printf("error closing rows: %v\n", err)
		}
	}()

	var feedbacks []*models.Feedback
	for rows.Next() {
		f := &models.Feedback{}
		err := rows.Scan(&f.ID, &f.Name, &f.Email, &f.Type, &f.Message, &f.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("error scanning feedback: %w", err)
		}
		feedbacks = append(feedbacks, f)
	}

	// FIX: Check for any error that occurred during the iteration
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error during feedback iteration: %w", err)
	}

	return feedbacks, nil
}

// GetCount gets the total count of feedback entries
func (r *FeedbackRepository) GetCount() (int, error) {
	query := `SELECT COUNT(*) FROM feedback`

	var count int
	err := r.db.QueryRow(query).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error getting feedback count: %w", err)
	}

	return count, nil
}

// Delete deletes a feedback entry by ID
func (r *FeedbackRepository) Delete(id int) error {
	query := `DELETE FROM feedback WHERE id = $1`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("error deleting feedback: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error checking rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("feedback not found")
	}

	return nil
}
