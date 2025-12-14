// Package handlers provides the HTTP handlers for managing user accounts, profiles, and administrative actions.
package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imLaanui/Financeu-platform/backend/internal/repository"
)

// UserHandler holds dependencies for user-related HTTP handlers,
// specifically the repositories needed to access user and lesson data.
type UserHandler struct {
	userRepo   *repository.UserRepository
	lessonRepo *repository.LessonRepository
}

// NewUserHandler creates and returns a new UserHandler instance,
// initializing it with the required UserRepository and LessonRepository.
func NewUserHandler(userRepo *repository.UserRepository, lessonRepo *repository.LessonRepository) *UserHandler {
	return &UserHandler{
		userRepo:   userRepo,
		lessonRepo: lessonRepo,
	}
}

// UpdateMembershipRequest defines the structure for a request to update a user's membership tier.
type UpdateMembershipRequest struct {
	Tier string `json:"tier" binding:"required,oneof=free premium pro"`
}

// UpdateRoleRequest defines the structure for admin to update a user's role
type UpdateRoleRequest struct {
	Role string `json:"role" binding:"required,oneof=user admin"`
}

// UpdateTierRequest defines the structure for admin to update a user's tier
type UpdateTierRequest struct {
	Tier string `json:"tier" binding:"required,oneof=free pro premium"`
}

// GetProfile returns the user's profile with lesson progress
func (h *UserHandler) GetProfile(c *gin.Context) {
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

	// Get completed lessons count
	completedCount, err := h.lessonRepo.GetCompletedCount(userID.(int))
	if err != nil {
		log.Printf("Error getting completed lessons: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get lesson count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":             user.ToResponse(),
		"completedLessons": completedCount,
	})
}

// UpdateMembership updates the user's membership tier
func (h *UserHandler) UpdateMembership(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	var req UpdateMembershipRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update user tier
	if err := h.userRepo.UpdateTier(userID.(int), req.Tier); err != nil {
		log.Printf("Error updating membership: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update membership"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Membership updated successfully"})
}

// ============================================================================
// ADMIN HANDLERS
// ============================================================================

// GetAllUsers returns all users (admin only)
func (h *UserHandler) GetAllUsers(c *gin.Context) {
	users, err := h.userRepo.GetAll()
	if err != nil {
		log.Printf("Error getting all users: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	// Convert to response format (without passwords)
	userResponses := make([]interface{}, len(users))
	for i, user := range users {
		userResponses[i] = user.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"users": userResponses,
	})
}

// AdminUpdateUserRole updates a user's role (admin only)
func (h *UserHandler) AdminUpdateUserRole(c *gin.Context) {
	// Get user ID from URL parameter
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	var req UpdateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert string ID to int
	var id int
	if _, err := fmt.Sscanf(userID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Check if user exists
	user, err := h.userRepo.GetByID(id)
	if err != nil {
		log.Printf("Error getting user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update role
	if err := h.userRepo.UpdateRole(id, req.Role); err != nil {
		log.Printf("Error updating user role: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User role updated successfully"})
}

// AdminUpdateUserTier updates a user's membership tier (admin only)
func (h *UserHandler) AdminUpdateUserTier(c *gin.Context) {
	// Get user ID from URL parameter
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	var req UpdateTierRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert string ID to int
	var id int
	if _, err := fmt.Sscanf(userID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Check if user exists
	user, err := h.userRepo.GetByID(id)
	if err != nil {
		log.Printf("Error getting user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update tier
	if err := h.userRepo.UpdateTier(id, req.Tier); err != nil {
		log.Printf("Error updating user tier: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user tier"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User tier updated successfully"})
}

// AdminDeleteUser deletes a user (admin only)
func (h *UserHandler) AdminDeleteUser(c *gin.Context) {
	// Get user ID from URL parameter
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Convert string ID to int
	var id int
	if _, err := fmt.Sscanf(userID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Prevent admin from deleting themselves
	currentUserID, exists := c.Get("userID")
	if exists && currentUserID.(int) == id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot delete your own account"})
		return
	}

	// Check if user exists
	user, err := h.userRepo.GetByID(id)
	if err != nil {
		log.Printf("Error getting user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Delete user
	if err := h.userRepo.Delete(id); err != nil {
		log.Printf("Error deleting user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
