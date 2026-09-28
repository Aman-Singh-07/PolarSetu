package handlers

import (
	"PolarSetu/internal/models"
	"PolarSetu/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MediaHandler struct {
	repo *repository.MediaRepo
}

func NewMediaHandler(repo *repository.MediaRepo) *MediaHandler {
	return &MediaHandler{repo: repo}
}

// List returns all media.
// GET /api/media
func (h *MediaHandler) List(c *gin.Context) {
	media, err := h.repo.ListAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DB_ERROR", "message": "Failed to fetch media"},
		})
		return
	}

	if media == nil {
		media = []models.Media{} // Enforce empty array instead of null
	}
	c.JSON(http.StatusOK, media)
}
