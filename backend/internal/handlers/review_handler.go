package handlers

import (
	"net/http"
	"strconv"

	"PolarSetu/internal/models"
	"PolarSetu/internal/repository"

	"github.com/gin-gonic/gin"
)

type ReviewHandler struct {
	repo *repository.ReviewRepo
}

func NewReviewHandler(repo *repository.ReviewRepo) *ReviewHandler {
	return &ReviewHandler{repo: repo}
}

// GetQueue returns all pending DRAFT AI generations.
// GET /api/review/queue
func (h *ReviewHandler) GetQueue(c *gin.Context) {
	queue, err := h.repo.GetPendingQueue(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DB_ERROR", "message": "Failed to fetch review queue"},
		})
		return
	}

	if queue == nil {
		queue = []models.AIGeneration{}
	}
	c.JSON(http.StatusOK, queue)
}

// ApproveDraft changes a draft's status to APPROVED.
// POST /api/review/:id/approve
func (h *ReviewHandler) ApproveDraft(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_PARAM", "message": "id must be an integer"}})
		return
	}

	if err := h.repo.UpdateStatus(c.Request.Context(), id, "APPROVED"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "DB_ERROR", "message": "Failed to approve draft"}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Draft approved"})
}

// RejectDraft changes a draft's status to REJECTED.
// POST /api/review/:id/reject
func (h *ReviewHandler) RejectDraft(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_PARAM", "message": "id must be an integer"}})
		return
	}

	if err := h.repo.UpdateStatus(c.Request.Context(), id, "REJECTED"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "DB_ERROR", "message": "Failed to reject draft"}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Draft rejected"})
}
