package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"Aicygram/internal/models"
	"Aicygram/internal/repository"
	"Aicygram/internal/services"

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
	Lang     string `json:"lang"`
}

type SocialCardRequest struct {
	ResourceIDs []string `json:"resource_ids"`
	MediaID     int      `json:"media_id"`
	Template    string   `json:"template"`
	Lang        string   `json:"lang"`
}

type LessonPlanRequest struct {
	ConceptID   int      `json:"concept_id" binding:"required"`
	ResourceIDs []string `json:"resource_ids" binding:"required"`
	Lang        string   `json:"lang"`
}

type AIHandler struct {
	resourceRepo   *repository.ResourceRepo
	reviewRepo     *repository.ReviewRepo
	searchRepo     *repository.SearchRepo
	mediaRepo      *repository.MediaRepo
	curriculumRepo *repository.CurriculumRepo
}

func NewAIHandler(
	resourceRepo *repository.ResourceRepo,
	reviewRepo *repository.ReviewRepo,
	searchRepo *repository.SearchRepo,
	mediaRepo *repository.MediaRepo,
	curriculumRepo *repository.CurriculumRepo,
) *AIHandler {
	return &AIHandler{
		resourceRepo:   resourceRepo,
		reviewRepo:     reviewRepo,
		searchRepo:     searchRepo,
		mediaRepo:      mediaRepo,
		curriculumRepo: curriculumRepo,
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
	var fullSources []models.Resource

	if len(req.ResourceIDs) > 0 {
		for _, id := range req.ResourceIDs {
			res, err := h.resourceRepo.GetByID(c.Request.Context(), id)
			if err != nil || res == nil {
				continue
			}
			validSourceIDs = append(validSourceIDs, res.ID)
			fullSources = append(fullSources, *res)
			contextBuilder.WriteString(fmt.Sprintf("[Resource: %s | Title: %s]\nOverview: %s\n", res.ID, res.Title, res.Description))

			chunks, err := h.resourceRepo.GetChunksByResourceID(c.Request.Context(), res.ID)
			if err == nil {
				for _, ch := range chunks {
					contextBuilder.WriteString(fmt.Sprintf("[Section: %s]: %s\n", ch.Section, ch.Content))
				}
			}
			contextBuilder.WriteString("\n")
		}
	} else {
		searchResults, err := h.searchRepo.Search(c.Request.Context(), req.Question, "", 0)
		if err == nil && len(searchResults) > 0 {
			for _, res := range searchResults {
				validSourceIDs = append(validSourceIDs, res.ID)
				fullSources = append(fullSources, res)
				contextBuilder.WriteString(fmt.Sprintf("[Resource: %s | Title: %s]\nOverview: %s\n", res.ID, res.Title, res.Description))
			}
		} else {
			c.JSON(http.StatusOK, gin.H{
				"answer":  "I couldn't find sufficient evidence in the AICYGRAM repository to answer this reliably.",
				"sources": []interface{}{},
			})
			return
		}
	}

	answer, err := services.AskAicygram(req.Question, contextBuilder.String(), validSourceIDs)
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
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": "Source resource not found"}})
		return
	}

	var contextBuilder strings.Builder
	contextBuilder.WriteString(fmt.Sprintf("[Title: %s, Region: %s, Year: %d]\nOverview: %s\n", res.Title, res.Region, res.Year, res.Description))
	chunks, err := h.resourceRepo.GetChunksByResourceID(c.Request.Context(), res.ID)
	if err == nil {
		for _, ch := range chunks {
			contextBuilder.WriteString(fmt.Sprintf("[Section: %s]: %s\n", ch.Section, ch.Content))
		}
	}

	lang := strings.ToLower(strings.TrimSpace(req.Lang))
	if lang == "" {
		lang = "en"
	}

	// 2. Call AI service
	content, err := services.GenerateOutreach(contextBuilder.String(), req.Audience, req.Format)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "AI_ERROR", "message": "Generation failed: " + err.Error()}})
		return
	}

	// 3. Save draft to DB for audit/review
	adminUserID := 1
	meta := map[string]interface{}{
		"lang": lang,
	}
	metaBytes, _ := json.Marshal(meta)

	savedDraft, err := h.reviewRepo.SaveDraft(c.Request.Context(), models.AIGeneration{
		UserID:     &adminUserID,
		SourceIDs:  []string{req.SourceID},
		Audience:   req.Audience,
		OutputType: req.Format,
		Content:    content,
		Status:     "DRAFT",
		Metadata:   metaBytes,
	})
	genID := 0
	if err == nil && savedDraft != nil {
		genID = savedDraft.ID
	} else if err != nil {
		fmt.Printf("Warning: failed to save AI generation log: %v\n", err)
	}

	c.JSON(http.StatusOK, gin.H{
		"id":      genID,
		"content": content,
	})
}

// GenerateSocialCard generates an AI punchy stat and outreach caption for social cards.
// POST /api/ai/social-card
func (h *AIHandler) GenerateSocialCard(c *gin.Context) {
	var req SocialCardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_REQUEST", "message": err.Error()}})
		return
	}

	// Validation 1: No resource IDs provided
	if len(req.ResourceIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "NO_RESOURCES", "message": "No resource IDs provided"}})
		return
	}

	// Validation 2: media_id must exist
	if req.MediaID <= 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "MEDIA_NOT_FOUND", "message": "media_id does not exist"}})
		return
	}
	mediaItem, err := h.mediaRepo.GetByID(c.Request.Context(), req.MediaID)
	if err != nil || mediaItem == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "MEDIA_NOT_FOUND", "message": "media_id does not exist"}})
		return
	}

	// Validation 3: Verify resources and build context
	var contextBuilder strings.Builder
	var validSourceIDs []string
	allResourcesExist := true

	for _, id := range req.ResourceIDs {
		res, err := h.resourceRepo.GetByID(c.Request.Context(), id)
		if err != nil || res == nil {
			allResourcesExist = false
			continue
		}
		validSourceIDs = append(validSourceIDs, res.ID)
		contextBuilder.WriteString(fmt.Sprintf("[Resource ID: %s | Title: %s | Region: %s | Year: %d]\nOverview: %s\n", res.ID, res.Title, res.Region, res.Year, res.Description))
		chunks, err := h.resourceRepo.GetChunksByResourceID(c.Request.Context(), res.ID)
		if err == nil {
			for _, ch := range chunks {
				contextBuilder.WriteString(fmt.Sprintf("[Section: %s]: %s\n", ch.Section, ch.Content))
			}
		}
		contextBuilder.WriteString("\n")
	}

	if len(validSourceIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "NO_RESOURCES", "message": "None of the specified resource IDs exist"}})
		return
	}

	template := req.Template
	if template == "" {
		template = "1:1"
	}
	lang := strings.ToLower(strings.TrimSpace(req.Lang))
	if lang == "" {
		lang = "en"
	}

	// Call AI service
	aiResult, err := services.GenerateSocialCard(contextBuilder.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "AI_ERROR", "message": "Generation failed: " + err.Error()}})
		return
	}

	// Citation validity computation per §1.3:
	// citation_valid = all provided resource_ids exist in DB AND stat/caption text generated
	citationValid := allResourcesExist && len(validSourceIDs) > 0 && aiResult.StatText != ""

	// Build metadata matching §1.3:
	resourceUrl := fmt.Sprintf("/research/%s", validSourceIDs[0])
	metadata := map[string]interface{}{
		"template":            template,
		"media_id":            req.MediaID,
		"stat_text":           aiResult.StatText,
		"caption":             aiResult.Caption,
		"lang":                lang,
		"resource_url":        resourceUrl,
		"citation_valid":      citationValid,
		"rendered_image_path": "",
	}
	metaBytes, _ := json.Marshal(metadata)

	// Save to Review DB
	adminUserID := 1
	savedDraft, err := h.reviewRepo.SaveDraft(c.Request.Context(), models.AIGeneration{
		UserID:     &adminUserID,
		SourceIDs:  validSourceIDs,
		Audience:   "General Public",
		OutputType: "Social Card",
		Content:    fmt.Sprintf("%s\n\n%s", aiResult.StatText, aiResult.Caption),
		Status:     "DRAFT",
		Metadata:   metaBytes,
	})
	genID := 0
	if err == nil && savedDraft != nil {
		genID = savedDraft.ID
	} else if err != nil {
		fmt.Printf("Warning: failed to save social card generation draft: %v\n", err)
	}

	c.JSON(http.StatusOK, gin.H{
		"id":             genID,
		"stat_text":      aiResult.StatText,
		"caption":        aiResult.Caption,
		"source_ids":     validSourceIDs,
		"citation_valid": citationValid,
		"status":         "DRAFT",
	})
}

// GenerateLessonPlan creates a curriculum-aligned lesson plan using real polar research data.
// POST /api/ai/lesson-plan
func (h *AIHandler) GenerateLessonPlan(c *gin.Context) {
	var req LessonPlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_REQUEST", "message": err.Error()}})
		return
	}

	if req.ConceptID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "INVALID_CONCEPT", "message": "concept_id must be a valid positive integer"}})
		return
	}

	if len(req.ResourceIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "NO_RESOURCES", "message": "No resource IDs provided"}})
		return
	}

	// 1. Fetch Concept
	concept, err := h.curriculumRepo.GetConceptByID(c.Request.Context(), req.ConceptID)
	if err != nil || concept == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "CONCEPT_NOT_FOUND", "message": "Curriculum concept not found"}})
		return
	}

	// 2. Fetch and build resource context
	var contextBuilder strings.Builder
	var validSourceIDs []string
	allResourcesExist := true

	for _, id := range req.ResourceIDs {
		res, err := h.resourceRepo.GetByID(c.Request.Context(), id)
		if err != nil || res == nil {
			allResourcesExist = false
			continue
		}
		validSourceIDs = append(validSourceIDs, res.ID)
		contextBuilder.WriteString(fmt.Sprintf("[Resource ID: %s | Title: %s | Region: %s | Year: %d]\nOverview: %s\n", res.ID, res.Title, res.Region, res.Year, res.Description))
		chunks, err := h.resourceRepo.GetChunksByResourceID(c.Request.Context(), res.ID)
		if err == nil {
			for _, ch := range chunks {
				contextBuilder.WriteString(fmt.Sprintf("[Section: %s]: %s\n", ch.Section, ch.Content))
			}
		}
		contextBuilder.WriteString("\n")
	}

	if len(validSourceIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "NO_RESOURCES", "message": "None of the specified resource IDs exist in the repository"}})
		return
	}

	lang := strings.ToLower(strings.TrimSpace(req.Lang))
	if lang == "" {
		lang = "en"
	}

	// 3. Call AI Service
	plan, citationValid, warnings, err := services.GenerateLessonPlan(
		contextBuilder.String(),
		concept.Class,
		concept.Subject,
		concept.Concept,
		validSourceIDs,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "AI_ERROR", "message": "Generation failed: " + err.Error()}})
		return
	}

	// If any requested resource ID did not exist, citation_valid is false per §2.4
	if !allResourcesExist {
		citationValid = false
		warnings = append(warnings, "Some requested resource IDs do not exist in the repository")
	}

	// 4. Save to Review DB as output_type = 'Lesson Plan'
	planJSONBytes, _ := json.Marshal(plan)
	planJSONStr := string(planJSONBytes)

	meta := models.LessonPlanMetadata{
		Class:         concept.Class,
		Subject:       concept.Subject,
		ConceptID:     concept.ID,
		Concept:       concept.Concept,
		Lang:          lang,
		CitationValid: citationValid,
		Warnings:      warnings,
	}
	metaBytes, _ := json.Marshal(meta)

	adminUserID := 1
	audience := fmt.Sprintf("Class %d %s", concept.Class, concept.Subject)
	savedDraft, err := h.reviewRepo.SaveDraft(c.Request.Context(), models.AIGeneration{
		UserID:     &adminUserID,
		SourceIDs:  validSourceIDs,
		Audience:   audience,
		OutputType: "Lesson Plan",
		Content:    planJSONStr,
		Status:     "DRAFT",
		Metadata:   metaBytes,
	})

	genID := 0
	if err == nil && savedDraft != nil {
		genID = savedDraft.ID
	} else if err != nil {
		fmt.Printf("Warning: failed to save lesson plan generation draft: %v\n", err)
	}

	c.JSON(http.StatusOK, gin.H{
		"id":             genID,
		"plan":           plan,
		"citation_valid": citationValid,
		"status":         "DRAFT",
		"warnings":       warnings,
	})
}

// RenderSocialCard is a stub that returns 501 Not Implemented (client-side export is primary).
// POST /api/ai/social-card/:id/render
func (h *AIHandler) RenderSocialCard(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"error": gin.H{
			"code":    "NOT_IMPLEMENTED",
			"message": "Server-side rendering is not implemented. Use client-side rendering via html-to-image.",
		},
	})
}
