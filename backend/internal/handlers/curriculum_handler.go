package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"Aicygram/internal/models"
	"Aicygram/internal/repository"

	"github.com/gin-gonic/gin"
)

type CurriculumHandler struct {
	curriculumRepo *repository.CurriculumRepo
	resourceRepo   *repository.ResourceRepo
}

func NewCurriculumHandler(curriculumRepo *repository.CurriculumRepo, resourceRepo *repository.ResourceRepo) *CurriculumHandler {
	return &CurriculumHandler{
		curriculumRepo: curriculumRepo,
		resourceRepo:   resourceRepo,
	}
}

type TagResourceRequest struct {
	ResourceID string `json:"resource_id" binding:"required"`
	ConceptID  int    `json:"concept_id"`
}

// ListConcepts returns all curriculum concepts filtered optionally by class and subject.
// GET /api/curriculum/concepts?class=10&subject=Science
func (h *CurriculumHandler) ListConcepts(c *gin.Context) {
	var class int
	if classStr := c.Query("class"); classStr != "" {
		if parsed, err := strconv.Atoi(classStr); err == nil {
			class = parsed
		}
	}
	subject := strings.TrimSpace(c.Query("subject"))

	concepts, err := h.curriculumRepo.ListConcepts(c.Request.Context(), class, subject)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DATABASE_ERROR", "message": "Failed to retrieve curriculum concepts: " + err.Error()},
		})
		return
	}

	if concepts == nil {
		concepts = make([]models.CurriculumConcept, 0)
	}

	c.JSON(http.StatusOK, concepts)
}

// GetResourcesForConcept returns all resources tagged to a curriculum concept.
// GET /api/curriculum/concepts/:id/resources
func (h *CurriculumHandler) GetResourcesForConcept(c *gin.Context) {
	idParam := c.Param("id")
	conceptID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{"code": "INVALID_ID", "message": "Concept ID must be an integer"},
		})
		return
	}

	// Verify concept exists
	concept, err := h.curriculumRepo.GetConceptByID(c.Request.Context(), conceptID)
	if err != nil || concept == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{"code": "CONCEPT_NOT_FOUND", "message": "Curriculum concept not found"},
		})
		return
	}

	resources, err := h.curriculumRepo.GetResourcesByConceptID(c.Request.Context(), conceptID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DATABASE_ERROR", "message": "Failed to retrieve tagged resources: " + err.Error()},
		})
		return
	}

	if resources == nil {
		resources = []models.Resource{}
	}

	c.JSON(http.StatusOK, resources)
}

// TagResource adds a link between a resource and a curriculum concept.
// POST /api/curriculum/concepts/:id/resources OR POST /api/curriculum/tags
func (h *CurriculumHandler) TagResource(c *gin.Context) {
	var req TagResourceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{"code": "INVALID_REQUEST", "message": err.Error()},
		})
		return
	}

	conceptID := req.ConceptID
	if idParam := c.Param("id"); idParam != "" {
		if parsed, err := strconv.Atoi(idParam); err == nil {
			conceptID = parsed
		}
	}

	if conceptID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{"code": "INVALID_CONCEPT_ID", "message": "concept_id must be a valid positive integer"},
		})
		return
	}

	// Check concept exists
	concept, err := h.curriculumRepo.GetConceptByID(c.Request.Context(), conceptID)
	if err != nil || concept == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{"code": "CONCEPT_NOT_FOUND", "message": "Curriculum concept does not exist"},
		})
		return
	}

	// Check resource exists
	res, err := h.resourceRepo.GetByID(c.Request.Context(), req.ResourceID)
	if err != nil || res == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{"code": "RESOURCE_NOT_FOUND", "message": "Resource does not exist"},
		})
		return
	}

	if err := h.curriculumRepo.TagResourceToConcept(c.Request.Context(), req.ResourceID, conceptID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DATABASE_ERROR", "message": "Failed to link resource to concept: " + err.Error()},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":      "success",
		"message":     "Resource linked to concept successfully",
		"resource_id": req.ResourceID,
		"concept_id":  conceptID,
	})
}

// UntagResource removes the association between a resource and a curriculum concept.
// DELETE /api/curriculum/concepts/:id/resources/:resourceId
func (h *CurriculumHandler) UntagResource(c *gin.Context) {
	conceptID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{"code": "INVALID_ID", "message": "Concept ID must be an integer"},
		})
		return
	}

	resourceID := c.Param("resourceId")
	if resourceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": gin.H{"code": "INVALID_RESOURCE_ID", "message": "Resource ID is required in URL path"},
		})
		return
	}

	if err := h.curriculumRepo.UntagResourceFromConcept(c.Request.Context(), resourceID, conceptID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DATABASE_ERROR", "message": "Failed to untag resource: " + err.Error()},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":      "success",
		"message":     "Resource untagged successfully",
		"resource_id": resourceID,
		"concept_id":  conceptID,
	})
}

// ListLessonPlans retrieves all stored lesson plans from ai_generations with optional class filter.
// GET /api/curriculum/lesson-plans
func (h *CurriculumHandler) ListLessonPlans(c *gin.Context) {
	var class int
	if classStr := c.Query("class"); classStr != "" {
		if parsed, err := strconv.Atoi(classStr); err == nil {
			class = parsed
		}
	}

	plans, err := h.curriculumRepo.ListLessonPlans(c.Request.Context(), class)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "DATABASE_ERROR", "message": "Failed to retrieve lesson plans: " + err.Error()},
		})
		return
	}

	if plans == nil {
		plans = make([]models.AIGeneration, 0)
	}

	c.JSON(http.StatusOK, plans)
}
