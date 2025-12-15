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

	"github.com/imLaanui/Financeu-platform/backend/internal/email"
	"github.com/imLaanui/Financeu-platform/backend/internal/jwtauth"
	"github.com/imLaanui/Financeu-platform/backend/internal/repository"
)

// AuthHandler holds dependencies for authentication-related HTTP handlers,
// including repositories and configuration settings (JWT secret, session expiry).
type AuthHandler struct {
	userRepo       *repository.UserRepository
	resetTokenRepo *repository.ResetTokenRepository
	emailService   *email.Service
	jwtSecret      string
	sessionExpiry  time.Duration
}

// NewAuthHandler creates and returns a new AuthHandler instance, initializing it
// with the necessary repositories and loading JWT configuration from environment variables.
func NewAuthHandler(userRepo *repository.UserRepository, resetTokenRepo *repository.ResetTokenRepository, emailService *email.Service) *AuthHandler {
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
		emailService:   emailService,
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

// VerifyEmailRequest defines the structure for email verification
type VerifyEmailRequest struct {
	Email string `json:"email" binding:"required,email"`
	Token string `json:"token" binding:"required"`
}

// Register creates a new user account and sends verification email
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

	// Generate verification token
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		log.Printf("Error generating verification token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate verification token"})
		return
	}
	verificationToken := hex.EncodeToString(tokenBytes)

	// Set token expiration to 24 hours from now
	expiresAt := time.Now().Add(24 * time.Hour)

	// Save verification token to database
	if err := h.userRepo.SetVerificationToken(user.ID, verificationToken, expiresAt); err != nil {
		log.Printf("Error setting verification token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set verification token"})
		return
	}

	// Send verification email
	if err := h.emailService.SendVerificationEmail(user.Email, user.Name, verificationToken); err != nil {
		log.Printf("Error sending verification email: %v", err)
		// Don't fail the registration if email fails, just log it
		log.Printf("User %s registered but verification email failed to send", user.Email)
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Registration successful! Please check your email to verify your account.",
		"user":    user.ToResponse(),
	})
}

// VerifyEmail verifies a user's email address
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	var req VerifyEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user by verification token
	user, err := h.userRepo.GetByVerificationToken(req.Token)
	if err != nil {
		log.Printf("Error getting user by token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	if user == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired verification token"})
		return
	}

	// Verify that the email matches
	if user.Email != req.Email {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email does not match verification token"})
		return
	}

	// Mark email as verified
	if err := h.userRepo.VerifyEmail(user.ID); err != nil {
		log.Printf("Error verifying email: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify email"})
		return
	}

	// Generate JWT token for auto-login after verification
	token, err := jwtauth.GenerateToken(user, h.jwtSecret, h.sessionExpiry)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		// Don't fail verification if token generation fails
		c.JSON(http.StatusOK, gin.H{"message": "Email verified successfully! Please login."})
		return
	}

	// Set cookie
	c.SetCookie("token", token, int(h.sessionExpiry.Seconds()), "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"message": "Email verified successfully!",
		"user":    user.ToResponse(),
		"token":   token,
	})
}

// ResendVerification resends the verification email
func (h *AuthHandler) ResendVerification(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "No account found with that email"})
		return
	}

	// Check if already verified
	if user.EmailVerified {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already verified"})
		return
	}

	// Generate new verification token
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		log.Printf("Error generating verification token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate verification token"})
		return
	}
	verificationToken := hex.EncodeToString(tokenBytes)

	// Set token expiration to 24 hours from now
	expiresAt := time.Now().Add(24 * time.Hour)

	// Save verification token to database
	if err := h.userRepo.SetVerificationToken(user.ID, verificationToken, expiresAt); err != nil {
		log.Printf("Error setting verification token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set verification token"})
		return
	}

	// Send verification email
	if err := h.emailService.SendVerificationEmail(user.Email, user.Name, verificationToken); err != nil {
		log.Printf("Error sending verification email: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send verification email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Verification email sent! Please check your inbox."})
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

	// Check if email is verified (optional - comment out if you want to allow unverified logins)
	if !user.EmailVerified {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Please verify your email before logging in",
			"emailVerified": false,
		})
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
		// For security, return success even if user doesn't exist
		c.JSON(http.StatusOK, gin.H{"message": "If an account exists with that email, a password reset link has been sent"})
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

	// Send password reset email
	if err := h.emailService.SendPasswordResetEmail(user.Email, user.Name, token); err != nil {
		log.Printf("Error sending password reset email: %v", err)
		// Don't expose email sending errors to users
		c.JSON(http.StatusOK, gin.H{"message": "If an account exists with that email, a password reset link has been sent"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "If an account exists with that email, a password reset link has been sent"})
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

	c.JSON(http.StatusOK, gin.H{"message": "Password has been reset successfully"})
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
