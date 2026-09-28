package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"PolarSetu/internal/models"
	"PolarSetu/internal/repository"
	"PolarSetu/internal/services" // Inject storage service

	"github.com/gin-gonic/gin"
)

type ResourceHandler struct {
	repo *repository.ResourceRepo
}

func NewResourceHandler(repo *repository.ResourceRepo) *ResourceHandler {
	return &ResourceHandler{repo: repo}
}

// List returns all resources, optionally filtered.
func (h *ResourceHandler) List(c *gin.Context) {
	resourceType := c.Query("type")
	region := c.Query("region")
	status := c.Query("status")
	yearStr := c.Query("year")

	var year int
	if yearStr != "" {
		var err error
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_PARAM", "message": "year must be an integer"}})
			return
		}
	}

	resources, err := h.repo.ListAll(c.Request.Context(), resourceType, region, year, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "DB_ERROR", "message": "Failed to fetch resources"}})
		return
	}

	if resources == nil {
		resources = []models.Resource{}
	}

	c.JSON(http.StatusOK, resources)
}

// GetByID returns a single resource with its linked expeditions.
func (h *ResourceHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	resource, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": "Resource not found"}})
		return
	}

	expeditions, err := h.repo.GetExpeditionsByResourceID(c.Request.Context(), id)
	if err != nil {
		expeditions = []models.Expedition{}
	}
	if expeditions == nil {
		expeditions = []models.Expedition{}
	}

	c.JSON(http.StatusOK, models.ResourceDetail{
		Resource:    *resource,
		Expeditions: expeditions,
	})
}

// Create creates a new resource.
func (h *ResourceHandler) Create(c *gin.Context) {
	var req models.CreateResourceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_REQUEST", "message": err.Error()}})
		return
	}

	validTypes := map[string]bool{
		"REPORT": true, "PUBLICATION": true, "DATASET": true,
		"PHOTO": true, "VIDEO": true, "ACTIVITY": true,
		"EXPEDITION": true, "OTHER": true,
	}
	if !validTypes[req.Type] {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_TYPE", "message": "type must be one of: REPORT, PUBLICATION, DATASET, PHOTO, VIDEO, ACTIVITY, EXPEDITION, OTHER"}})
		return
	}

	resource, err := h.repo.Create(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "DB_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusCreated, resource)
}

// UploadFile intercepts a multipart form datastream, pipes it to Supabase Storage, and updates the db storage_path.
// POST /api/resources/:id/upload
func (h *ResourceHandler) UploadFile(c *gin.Context) {
	id := c.Param("id")

	// Pre-check if resource exists before uploading
	_, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": "Resource not found"}})
		return
	}

	// Retrieve file from form payload
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_FILE", "message": "File is missing in the payload"}})
		return
	}

	// Pipe securely to our new Supabase Cloud Service
	publicURL, err := services.UploadToSupabase(file, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "STORAGE_ERROR", "message": "Failed to upload file to Supabase: " + err.Error()}})
		return
	}

	// Update the database to reflect the new storage string location
	err = h.repo.UpdateStoragePath(c.Request.Context(), id, publicURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "DB_ERROR", "message": "Failed to update target resource storage link"}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": fmt.Sprintf("File %s securely uploaded", file.Filename),
		"url":     publicURL,
	})
}
