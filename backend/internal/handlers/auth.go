// Package handlers provides the HTTP handlers for the application's authentication and user-related routes.
package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"github.com/imLaanui/Financeu-platform/backend/internal/repository"
	"github.com/imLaanui/Financeu-platform/backend/internal/jwtauth"
)

// AuthHandler holds dependencies for authentication-related HTTP handlers,
// including repositories and configuration settings (JWT secret, session expiry).
type AuthHandler struct {
	userRepo       *repository.UserRepository
	resetTokenRepo *repository.ResetTokenRepository
	jwtSecret      string
	sessionExpiry  time.Duration
}

// NewAuthHandler creates and returns a new AuthHandler instance, initializing it
// with the necessary repositories and loading JWT configuration from environment variables.
func NewAuthHandler(userRepo *repository.UserRepository, resetTokenRepo *repository.ResetTokenRepository) *AuthHandler {
	// Get JWT settings from environment
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key-change-this" // fallback
	}

	expiryStr := os.Getenv("SESSION_EXPIRY")
	if expiryStr == "" {
		expiryStr = "168h" // 7 days default
	}
	expiry, err := time.ParseDuration(expiryStr)
	if err != nil {
		expiry = 168 * time.Hour
	}

	return &AuthHandler{
		userRepo:       userRepo,
		resetTokenRepo: resetTokenRepo,
		jwtSecret:      jwtSecret,
		sessionExpiry:  expiry,
	}
}

// RegisterRequest defines the structure for a new user registration request.
type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest defines the structure for a user login request.
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// ForgotPasswordRequest defines the structure for a forgot password request,
// requiring only the user's email.
type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// ResetPasswordRequest defines the structure for a password reset request,
// requiring email, token, and a new password.
type ResetPasswordRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=6"`
}

// Register creates a new user account
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	existingUser, err := h.userRepo.GetByEmail(req.Email)
	if err != nil {
		log.Printf("Error checking existing user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	if existingUser != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}

	// Create user
	user, err := h.userRepo.Create(req.Name, req.Email, string(hashedPassword))
	if err != nil {
		log.Printf("Error creating user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate JWT token
	token, err := jwtauth.GenerateToken(user, h.jwtSecret, h.sessionExpiry)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Set cookie
	c.SetCookie("token", token, int(h.sessionExpiry.Seconds()), "/", "", false, true)

	c.JSON(http.StatusCreated, gin.H{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// Login authenticates a user
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user by email
	user, err := h.userRepo.GetByEmail(req.Email)
	if err != nil {
		log.Printf("Error getting user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	if user == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email or password"})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email or password"})
		return
	}

	// Generate JWT token
	token, err := jwtauth.GenerateToken(user, h.jwtSecret, h.sessionExpiry)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Set cookie
	c.SetCookie("token", token, int(h.sessionExpiry.Seconds()), "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// Logout clears the authentication cookie
func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

// ForgotPassword initiates password reset process
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	user, err := h.userRepo.GetByEmail(req.Email)
	if err != nil {
		log.Printf("Error getting user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	if user == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No account found with that email"})
		return
	}

	// Generate random token
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		log.Printf("Error generating token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
	token := hex.EncodeToString(tokenBytes)

	// Set expiration to 1 hour from now
	expiresAt := time.Now().Add(time.Hour)

	// Save token to database
	if err := h.resetTokenRepo.Create(req.Email, token, expiresAt); err != nil {
		log.Printf("Error creating reset token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create reset token"})
		return
	}

	// TODO: Send email with reset link
	// For now, just log it (in production, integrate with email service)
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}
	log.Printf("Reset link for %s: %s/reset-password?token=%s&email=%s", req.Email, frontendURL, token, req.Email)

	c.JSON(http.StatusOK, gin.H{"message": "Password reset email sent"})
}

// ResetPassword completes the password reset process
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate token
	resetToken, err := h.resetTokenRepo.GetValid(req.Email, req.Token)
	if err != nil {
		log.Printf("Error validating token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	if resetToken == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired token"})
		return
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}

	// Update password
	if err := h.userRepo.UpdatePassword(req.Email, string(hashedPassword)); err != nil {
		log.Printf("Error updating password: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	// Mark token as used
	if err := h.resetTokenRepo.MarkUsed(resetToken.ID); err != nil {
		log.Printf("Warning: Failed to mark token as used: %v", err)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password has been reset"})
}

// GetCurrentUser returns the currently authenticated user
func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	user, err := h.userRepo.GetByID(userID.(int))
	if err != nil {
		log.Printf("Error getting user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user.ToResponse()})
}
