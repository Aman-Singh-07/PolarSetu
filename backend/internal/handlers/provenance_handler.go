package handlers

import (
	"net/http"

	"PolarSetu/internal/models"
	"PolarSetu/internal/repository"

	"github.com/gin-gonic/gin"
)

type ProvenanceHandler struct {
	repo *repository.ProvenanceRepo
}

func NewProvenanceHandler(repo *repository.ProvenanceRepo) *ProvenanceHandler {
	return &ProvenanceHandler{repo: repo}
}

// GetRelations returns all graph links extending from or connecting to a resource ID.
// GET /api/resources/:id/relations
func (h *ProvenanceHandler) GetRelations(c *gin.Context) {
	id := c.Param("id")

	relations, err := h.repo.GetRelatedResources(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "DB_ERROR", "message": "Failed to fetch resource relations"}})
		return
	}

	if relations == nil {
		relations = []models.ResourceRelation{}
	}

	c.JSON(http.StatusOK, relations)
}

// CreateRelation permanently maps two resources together (Provenance).
// POST /api/resources/:id/relations
func (h *ProvenanceHandler) CreateRelation(c *gin.Context) {
	id := c.Param("id")

	var req struct {
		ToResourceID string `json:"toResourceId" binding:"required"`
		RelationType string `json:"relationType" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_REQUEST", "message": err.Error()}})
		return
	}

	rel := models.ResourceRelation{
		FromResourceID: id,
		ToResourceID:   req.ToResourceID,
		RelationType:   req.RelationType,
	}

	if err := h.repo.CreateRelation(c.Request.Context(), rel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "DB_ERROR", "message": "Failed to create relation"}})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "relation": rel})
}
