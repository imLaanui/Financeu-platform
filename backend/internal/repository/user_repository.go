// Package repository provides data access methods for interacting with the database, abstracting the SQL logic from the business handlers.
package repository

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/imLaanui/Financeu-platform/backend/internal/models"
)

// UserRepository provides methods for managing user account data in the database.
type UserRepository struct {
	db *sql.DB
}

// NewUserRepository creates and returns a new UserRepository instance.
func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// GetByEmail finds a user by email (case-insensitive)
func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, email, password, name, role, membership_tier, created_at, updated_at
		FROM users
		WHERE LOWER(email) = LOWER($1)
	`
	user := &models.User{}
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.Role,
		&user.MembershipTier,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil // User not found, return nil without error
	}
	if err != nil {
		return nil, fmt.Errorf("error getting user by email: %w", err)
	}

	return user, nil
}

// GetByID finds a user by ID
func (r *UserRepository) GetByID(id int) (*models.User, error) {
	query := `
		SELECT id, email, password, name, role, membership_tier, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	user := &models.User{}
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.Role,
		&user.MembershipTier,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("error getting user by ID: %w", err)
	}

	return user, nil
}

// Create creates a new user with default role of 'user'
func (r *UserRepository) Create(name, email, hashedPassword string) (*models.User, error) {
	query := `
		INSERT INTO users (name, email, password, role, membership_tier)
		VALUES ($1, $2, $3, 'user', 'free')
		RETURNING id, email, name, role, membership_tier, created_at, updated_at
	`
	user := &models.User{}
	err := r.db.QueryRow(query, name, email, hashedPassword).Scan(
		&user.ID,
		&user.Email,
		&user.Name,
		&user.Role,
		&user.MembershipTier,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			return nil, fmt.Errorf("user with this email already exists")
		}
		return nil, fmt.Errorf("error creating user: %w", err)
	}

	return user, nil
}

// UpdatePassword updates a user's password
func (r *UserRepository) UpdatePassword(email, hashedPassword string) error {
	query := `
		UPDATE users
		SET password = $1, updated_at = CURRENT_TIMESTAMP
		WHERE LOWER(email) = LOWER($2)
	`
	result, err := r.db.Exec(query, hashedPassword, email)
	if err != nil {
		return fmt.Errorf("error updating password: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error checking rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}

// UpdateTier updates a user's membership tier
func (r *UserRepository) UpdateTier(userID int, tier string) error {
	query := `
		UPDATE users
		SET membership_tier = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
	`
	_, err := r.db.Exec(query, tier, userID)
	if err != nil {
		return fmt.Errorf("error updating user tier: %w", err)
	}

	return nil
}

// UpdateRole updates a user's role (admin use only)
func (r *UserRepository) UpdateRole(userID int, role string) error {
	query := `
		UPDATE users
		SET role = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
	`
	_, err := r.db.Exec(query, role, userID)
	if err != nil {
		return fmt.Errorf("error updating user role: %w", err)
	}

	return nil
}

// GetAll retrieves all users (admin only)
func (r *UserRepository) GetAll() ([]*models.User, error) {
	query := `
		SELECT id, email, password, name, role, membership_tier, created_at, updated_at
		FROM users
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error getting all users: %w", err)
	}
	defer rows.Close()

	var users []*models.User
	for rows.Next() {
		user := &models.User{}
		err := rows.Scan(
			&user.ID,
			&user.Email,
			&user.Password,
			&user.Name,
			&user.Role,
			&user.MembershipTier,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning user: %w", err)
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating users: %w", err)
	}

	return users, nil
}

// Delete removes a user from the database (admin only)
func (r *UserRepository) Delete(userID int) error {
	query := `DELETE FROM users WHERE id = $1`

	result, err := r.db.Exec(query, userID)
	if err != nil {
		return fmt.Errorf("error deleting user: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error checking rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("user not found")
	}

	return nil
}
