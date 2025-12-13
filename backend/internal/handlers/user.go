package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imLaanui/Financeu-platform/backend/internal/repository"
)

type UserHandler struct {
	userRepo   *repository.UserRepository
	lessonRepo *repository.LessonRepository
}

func NewUserHandler(userRepo *repository.UserRepository, lessonRepo *repository.LessonRepository) *UserHandler {
	return &UserHandler{
		userRepo:   userRepo,
		lessonRepo: lessonRepo,
	}
}

type UpdateMembershipRequest struct {
	Tier string `json:"tier" binding:"required,oneof=free premium pro"`
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
