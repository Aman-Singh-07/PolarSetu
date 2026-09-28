package handlers

import (
	"net/http"
	"strconv"

	"PolarSetu/internal/models"
	"PolarSetu/internal/repository"

	"github.com/gin-gonic/gin"
)

type SearchHandler struct {
	searchRepo   *repository.SearchRepo
	resourceRepo *repository.ResourceRepo // Fallback repo
}

func NewSearchHandler(searchRepo *repository.SearchRepo, resourceRepo *repository.ResourceRepo) *SearchHandler {
	return &SearchHandler{
		searchRepo:   searchRepo,
		resourceRepo: resourceRepo,
	}
}

// Search coordinates queries against the Postgres Full-Text Search index.
// GET /api/search?q=XYZ&type=REPORT&year=2024
func (h *SearchHandler) Search(c *gin.Context) {
	query := c.Query("q")
	resourceType := c.Query("type")
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

	// Fail-safe logic: If query string is missing, degrade gracefully to a standard DB list operation
	if query == "" {
		resources, err := h.resourceRepo.ListAll(c.Request.Context(), resourceType, "", year, "")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": gin.H{"code": "DB_ERROR", "message": "Failed to list resources"},
			})
			return
		}
		if resources == nil {
			resources = []models.Resource{}
		}
		c.JSON(http.StatusOK, gin.H{"query": "", "results": resources})
		return
	}

	// Execute FTS engine
	results, err := h.searchRepo.Search(c.Request.Context(), query, resourceType, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "SEARCH_ERROR", "message": "Failed to process search query: " + err.Error()},
		})
		return
	}

	if results == nil {
		results = []models.Resource{}
	}

	// Return data formatted explicitly matching Section 14.1 of Handbook API Contract
	c.JSON(http.StatusOK, gin.H{
		"query":   query,
		"results": results,
	})
}
