package repository

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/imLaanui/Financeu-platform/backend/internal/models"
)

type ResetTokenRepository struct {
	db *sql.DB
}

func NewResetTokenRepository(db *sql.DB) *ResetTokenRepository {
	return &ResetTokenRepository{db: db}
}

// Create creates a new reset token (invalidates old ones first)
func (r *ResetTokenRepository) Create(email, token string, expiresAt time.Time) error {
	// First, invalidate any existing tokens for this email
	invalidateQuery := `
		UPDATE password_reset_tokens
		SET used = true
		WHERE LOWER(email) = LOWER($1) AND used = false
	`
	_, err := r.db.Exec(invalidateQuery, email)
	if err != nil {
		return fmt.Errorf("error invalidating old tokens: %w", err)
	}

	// Create new token
	createQuery := `
		INSERT INTO password_reset_tokens (email, token, expires_at)
		VALUES ($1, $2, $3)
	`
	_, err = r.db.Exec(createQuery, email, token, expiresAt)
	if err != nil {
		return fmt.Errorf("error creating reset token: %w", err)
	}

	return nil
}

// GetValid gets a valid (unused and not expired) reset token
func (r *ResetTokenRepository) GetValid(email, token string) (*models.ResetToken, error) {
	query := `
		SELECT id, email, token, expires_at, created_at, used
		FROM password_reset_tokens
		WHERE LOWER(email) = LOWER($1)
		AND token = $2
		AND used = false
		AND expires_at > CURRENT_TIMESTAMP
		ORDER BY created_at DESC
		LIMIT 1
	`

	resetToken := &models.ResetToken{}
	err := r.db.QueryRow(query, email, token).Scan(
		&resetToken.ID,
		&resetToken.Email,
		&resetToken.Token,
		&resetToken.ExpiresAt,
		&resetToken.CreatedAt,
		&resetToken.Used,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("error getting reset token: %w", err)
	}

	return resetToken, nil
}

// MarkUsed marks a reset token as used
func (r *ResetTokenRepository) MarkUsed(id int) error {
	query := `UPDATE password_reset_tokens SET used = true WHERE id = $1`

	_, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("error marking token as used: %w", err)
	}

	return nil
}
