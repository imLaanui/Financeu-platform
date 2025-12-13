package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imLaanui/Financeu-platform/backend/internal/repository"
)

type LessonHandler struct {
	lessonRepo *repository.LessonRepository
}

func NewLessonHandler(lessonRepo *repository.LessonRepository) *LessonHandler {
	return &LessonHandler{
		lessonRepo: lessonRepo,
	}
}

type CompleteLessonRequest struct {
	LessonID string `json:"lessonId" binding:"required"`
}

// GetProgress returns the user's lesson progress
func (h *LessonHandler) GetProgress(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	progress, err := h.lessonRepo.GetUserProgress(userID.(int))
	if err != nil {
		log.Printf("Error getting progress: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get progress"})
		return
	}

	c.JSON(http.StatusOK, progress)
}

// CompleteLesson marks a lesson as completed
func (h *LessonHandler) CompleteLesson(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

	var req CompleteLessonRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.lessonRepo.MarkLessonComplete(userID.(int), req.LessonID); err != nil {
		log.Printf("Error marking lesson complete: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark lesson as complete"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Lesson marked as complete"})
}

// GetLessons returns available lessons (can be static or from DB)
func (h *LessonHandler) GetLessons(c *gin.Context) {
	// This returns a static list of available lessons
	// You can modify this to fetch from database if you store lesson metadata there

	lessons := []gin.H{
		{
			"id":          "pillar1-lesson1",
			"title":       "Introduction to Financial Literacy",
			"description": "Learn the basics of financial literacy",
			"pillar":      1,
		},
		{
			"id":          "pillar1-lesson2",
			"title":       "Understanding Money",
			"description": "Core concepts about money and its functions",
			"pillar":      1,
		},
		// Add more lessons as needed based on your curriculum
	}

	c.JSON(http.StatusOK, gin.H{"lessons": lessons})
}
