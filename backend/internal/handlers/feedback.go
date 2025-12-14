// Package handlers provides the HTTP handlers for the application, including submission and administration of feedback.
package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/imLaanui/Financeu-platform/backend/internal/repository"
)

// FeedbackHandler holds the dependency for interacting with the feedback data store.
type FeedbackHandler struct {
	feedbackRepo *repository.FeedbackRepository
}

// NewFeedbackHandler creates and returns a new FeedbackHandler instance,
// initializing it with the required FeedbackRepository.
func NewFeedbackHandler(feedbackRepo *repository.FeedbackRepository) *FeedbackHandler {
	return &FeedbackHandler{
		feedbackRepo: feedbackRepo,
	}
}

// SubmitFeedbackRequest defines the structure for a user's request to submit feedback.
type SubmitFeedbackRequest struct {
	Name         *string `json:"name"`
	Email        *string `json:"email"`
	FeedbackType string  `json:"feedbackType" binding:"required"`
	Message      string  `json:"message" binding:"required,min=10"`
}

// SubmitFeedback creates a new feedback entry
func (h *FeedbackHandler) SubmitFeedback(c *gin.Context) {
	var req SubmitFeedbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Additional validation
	if len(req.Message) < 10 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Message must be at least 10 characters long"})
		return
	}

	// Create feedback
	feedbackID, err := h.feedbackRepo.Create(req.Name, req.Email, req.FeedbackType, req.Message)
	if err != nil {
		log.Printf("Error creating feedback: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit feedback"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "Feedback submitted successfully",
		"feedbackId": feedbackID,
	})
}

// AdminGetFeedback returns all feedback entries (admin only)
func (h *FeedbackHandler) AdminGetFeedback(c *gin.Context) {
	// Get all feedback
	feedback, err := h.feedbackRepo.GetAll()
	if err != nil {
		log.Printf("Error getting feedback: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch feedback"})
		return
	}

	// Get count
	count, err := h.feedbackRepo.GetCount()
	if err != nil {
		log.Printf("Error getting feedback count: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get feedback count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"feedback": feedback,
		"total":    count,
	})
}

// AdminDeleteFeedback deletes a feedback entry specified by ID (admin only)
func (h *FeedbackHandler) AdminDeleteFeedback(c *gin.Context) {
	idStr := c.Param("id")
	if idStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Feedback ID is required"})
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid feedback ID"})
		return
	}

	if err := h.feedbackRepo.Delete(id); err != nil {
		if err.Error() == "feedback not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Feedback not found"})
			return
		}
		log.Printf("Error deleting feedback: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete feedback"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Feedback deleted successfully"})
}
