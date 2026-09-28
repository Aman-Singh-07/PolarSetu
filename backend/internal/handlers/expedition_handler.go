package handlers

import (
	"net/http"
	"strconv"

	"PolarSetu/internal/models"
	"PolarSetu/internal/repository"

	"github.com/gin-gonic/gin"
)

type ExpeditionHandler struct {
	repo *repository.ExpeditionRepo
}

func NewExpeditionHandler(repo *repository.ExpeditionRepo) *ExpeditionHandler {
	return &ExpeditionHandler{repo: repo}
}

// List returns all expeditions, optionally filtered.
// GET /api/expeditions?region=Arctic&year=2024
func (h *ExpeditionHandler) List(c *gin.Context) {
	region := c.Query("region")
	yearStr := c.Query("year")

	var year int
	if yearStr != "" {
		var err error
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": gin.H{"code": "INVALID_PARAM", "message": "year must be an integer"},
			})
			return
		}
	}

	expeditions, err := h.repo.ListAll(c.Request.Context(), region, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DB_ERROR", "message": err.Error()},
		})
		return
	}

	// Return empty array instead of null
	if expeditions == nil {
		expeditions = []models.Expedition{}
	}

	c.JSON(http.StatusOK, expeditions)
}

// GetByID returns a single expedition with its linked resources.
// GET /api/expeditions/:id
func (h *ExpeditionHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{"code": "INVALID_PARAM", "message": "id must be an integer"},
		})
		return
	}

	expedition, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{"code": "NOT_FOUND", "message": "Expedition not found"},
		})
		return
	}

	// Fetch linked resources
	resources, err := h.repo.GetResourcesByExpeditionID(c.Request.Context(), id)
	if err != nil {
		resources = []models.Resource{}
	}
	if resources == nil {
		resources = []models.Resource{}
	}

	c.JSON(http.StatusOK, models.ExpeditionDetail{
		Expedition: *expedition,
		Resources:  resources,
	})
}

// Create creates a new expedition.
// POST /api/expeditions (Protected)
func (h *ExpeditionHandler) Create(c *gin.Context) {
	var req models.CreateExpeditionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{"code": "INVALID_REQUEST", "message": err.Error()},
		})
		return
	}

	expedition, err := h.repo.Create(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DB_ERROR", "message": "Failed to create expedition"},
		})
		return
	}

	c.JSON(http.StatusCreated, expedition)
}
