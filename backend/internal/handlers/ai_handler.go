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
	searchRepo   *repository.SearchRepo
}

func NewAIHandler(resourceRepo *repository.ResourceRepo, reviewRepo *repository.ReviewRepo, searchRepo *repository.SearchRepo) *AIHandler {
	return &AIHandler{
		resourceRepo: resourceRepo,
		reviewRepo:   reviewRepo,
		searchRepo:   searchRepo,
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
	var fullSources []map[string]string

	if len(req.ResourceIDs) > 0 {
		for _, id := range req.ResourceIDs {
			res, err := h.resourceRepo.GetByID(c.Request.Context(), id)
			if err == nil && res != nil {
				contextBuilder.WriteString(fmt.Sprintf("[Source ID: %s, Title: %s] %s\n", res.ID, res.Title, res.Description))
				validSourceIDs = append(validSourceIDs, res.ID)
				fullSources = append(fullSources, map[string]string{
					"id": id,
					"title": res.Title,
					"type": res.Type,
				})
			}
		}
	} else {
		// If no specific resource IDs are provided, do a keyword search
		results, err := h.searchRepo.Search(c.Request.Context(), req.Question, "", 0)
		if err == nil && len(results) > 0 {
			// take top 3
			limit := 3
			if len(results) < 3 {
				limit = len(results)
			}
			for i := 0; i < limit; i++ {
				res := results[i]
				contextBuilder.WriteString(fmt.Sprintf("[Source ID: %s, Title: %s] %s\n", res.ID, res.Title, res.Description))
				validSourceIDs = append(validSourceIDs, res.ID)
				fullSources = append(fullSources, map[string]string{
					"id": res.ID,
					"title": res.Title,
					"type": res.Type,
				})
			}
		}
		
		if len(validSourceIDs) == 0 {
			c.JSON(http.StatusOK, gin.H{
				"answer":  "I couldn't find sufficient evidence in the POLARSETU repository to answer this reliably.",
				"sources": []interface{}{},
			})
			return
		}
	}

	answer, err := services.AskPolarSetu(req.Question, contextBuilder.String(), validSourceIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "AI_ERROR", "message": "Generation failed: " + err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"answer":  answer,
		"sources": fullSources,
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
