package handlers

import (
	"PolarSetu/internal/models"
	"PolarSetu/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ActivityHandler struct {
	repo *repository.ActivityRepo
}

func NewActivityHandler(repo *repository.ActivityRepo) *ActivityHandler {
	return &ActivityHandler{repo: repo}
}

// List returns all activities.
// GET /api/activities
func (h *ActivityHandler) List(c *gin.Context) {
	activities, err := h.repo.ListAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DB_ERROR", "message": "Failed to fetch activities"},
		})
		return
	}

	if activities == nil {
		activities = []models.Activity{}
	}
	c.JSON(http.StatusOK, activities)
}
