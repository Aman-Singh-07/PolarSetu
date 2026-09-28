package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"PolarSetu/internal/models"
	"PolarSetu/internal/repository"
	"PolarSetu/internal/services"

	"github.com/gin-gonic/gin"
)

type AskRequest struct {
	Question    string   `json:"question" binding:"required"`
	ResourceIDs []string `json:"resource_ids"`
}

type OutreachRequest struct {
	SourceID string `json:"sourceId" binding:"required"`
	Audience string `json:"audience" binding:"required"`
	Format   string `json:"format" binding:"required"`
}

type AIHandler struct {
	resourceRepo *repository.ResourceRepo
	reviewRepo   *repository.ReviewRepo
}

func NewAIHandler(resourceRepo *repository.ResourceRepo, reviewRepo *repository.ReviewRepo) *AIHandler {
	return &AIHandler{
		resourceRepo: resourceRepo,
		reviewRepo:   reviewRepo,
	}
}

// Ask coordinates the grounded Q&A.
// POST /api/ai/ask
func (h *AIHandler) Ask(c *gin.Context) {
	var req AskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_REQUEST", "message": err.Error()}})
		return
	}

	var contextBuilder strings.Builder
	var validSourceIDs []string

	if len(req.ResourceIDs) > 0 {
		for _, id := range req.ResourceIDs {
			res, err := h.resourceRepo.GetByID(c.Request.Context(), id)
			if err == nil && res != nil {
				contextBuilder.WriteString(fmt.Sprintf("[Source ID: %s, Title: %s] %s\n", res.ID, res.Title, res.Description))
				validSourceIDs = append(validSourceIDs, res.ID)
			}
		}
	} else {
		c.JSON(http.StatusOK, gin.H{
			"answer":  "The available sources do not provide enough evidence.",
			"sources": []interface{}{},
		})
		return
	}

	answer, err := services.AskPolarSetu(req.Question, contextBuilder.String(), validSourceIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "AI_ERROR", "message": "Generation failed: " + err.Error()}})
		return
	}

	sourcesResponse := []map[string]string{}
	for _, id := range validSourceIDs {
		sourcesResponse = append(sourcesResponse, map[string]string{"id": id})
	}

	c.JSON(http.StatusOK, gin.H{
		"answer":  answer,
		"sources": sourcesResponse,
	})
}

// GenerateOutreach calls the Groq engine to format structured outreach content, then saves to the Review DB.
// POST /api/ai/outreach
func (h *AIHandler) GenerateOutreach(c *gin.Context) {
	var req OutreachRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_REQUEST", "message": err.Error()}})
		return
	}

	// 1. Fetch source content
	res, err := h.resourceRepo.GetByID(c.Request.Context(), req.SourceID)
	if err != nil || res == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": "Source ID not found"}})
		return
	}
	contextText := fmt.Sprintf("[%s] %s", res.Title, res.Description)

	// 2. Call AI Service (structured generation)
	rawJSONString, err := services.GenerateOutreach(contextText, req.Audience, req.Format)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "AI_ERROR", "message": "Outreach generation failed: " + err.Error()}})
		return
	}

	// Double check it unmarshals successfully to prove it generated valid JSON
	var parsed map[string]interface{}
	if err := json.Unmarshal([]byte(rawJSONString), &parsed); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "PARSE_ERROR", "message": "Failed to parse structured output from AI"}})
		return
	}

	// 3. Construct and save the Draft natively into PostgreSQL (DRAFT Status applied automatically)
	draftPayload := models.AIGeneration{
		SourceIDs:  []string{req.SourceID},
		Audience:   req.Audience,
		OutputType: req.Format,
		Content:    rawJSONString, // We store the whole structured JSON string for flexibility
	}

	savedDraft, err := h.reviewRepo.SaveDraft(c.Request.Context(), draftPayload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "DB_ERROR", "message": "Failed to save draft to queue"}})
		return
	}

	// 4. Return to frontend
	c.JSON(http.StatusCreated, savedDraft)
}
