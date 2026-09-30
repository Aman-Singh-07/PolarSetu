package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"strings"

	"Aicygram/internal/models"
)

type GroqMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GroqRequest struct {
	Model          string                 `json:"model"`
	Messages       []GroqMessage          `json:"messages"`
	Temperature    float64                `json:"temperature"`
	ResponseFormat map[string]interface{} `json:"response_format,omitempty"`
}

type GroqResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

type SocialCardAIOutput struct {
	StatText string `json:"stat_text"`
	Caption  string `json:"caption"`
}

func getGroqModel() string {
	if m := os.Getenv("GROQ_MODEL"); m != "" {
		return m
	}
	return "openai/gpt-oss-120b"
}

func AskAicygram(question string, contextText string, validSourceIDs []string) (string, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GROQ_API_KEY environment variable is not set")
	}

	systemPrompt := `You are Aicygram AI, an expert assistant on Indian Polar research, Antarctic, Arctic, and Southern Ocean expeditions.
Answer the user's question using ONLY the facts present in the provided source context.
Do not fabricate facts, statistics, or source IDs.
If the information is not contained in the context, clearly state that the repository does not have sufficient information.
Always cite your sources in the format: [Source: RESOURCE_ID].`

	userPrompt := fmt.Sprintf("Context Information:\n%s\n\nQuestion: %s\n\nAnswer:", contextText, question)

	reqBody := GroqRequest{
		Model: getGroqModel(),
		Messages: []GroqMessage{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: userPrompt},
		},
		Temperature: 0.2,
	}

	rawAnswer, err := executeGroqCall(apiKey, reqBody)
	if err != nil {
		return "", err
	}

	validatedAnswer := validateCitations(rawAnswer, validSourceIDs)
	return validatedAnswer, nil
}

func GenerateOutreach(contextText string, audience string, format string) (string, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GROQ_API_KEY environment variable is not set")
	}

	systemPrompt := fmt.Sprintf(`You are an expert scientific communicator for India's National Centre for Polar and Ocean Research (NCPOR).
Your job is to translate complex polar and oceanographic research into public outreach content.
Target Audience: %s
Output Format: %s
Rules:
1. Stay strictly faithful to the scientific facts in the source context.
2. Adopt a tone and vocabulary appropriate for the target audience.
3. Highlight India's scientific contributions and societal relevance.
4. Output must be ready for publication or broadcast.`, audience, format)

	systemPrompt += "\n5. Language requirement: Write in clear, compelling English."

	userPrompt := fmt.Sprintf("Source Material:\n%s\n\nPlease generate the outreach draft.", contextText)

	reqBody := GroqRequest{
		Model: getGroqModel(),
		Messages: []GroqMessage{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: userPrompt},
		},
		Temperature: 0.4,
	}

	return executeGroqCall(apiKey, reqBody)
}

// GenerateSocialCard instructs Groq to extract a key statistic and outreach caption from resource context.
// Follows JSON mode with retries.
func GenerateSocialCard(contextText string) (*SocialCardAIOutput, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GROQ_API_KEY environment variable is not set")
	}

	systemPrompt := `You are Aicygram, an expert scientific communicator and outreach specialist for India's National Centre for Polar and Ocean Research (NCPOR/MoES).
Your task is to extract a single key scientific statistic or finding and an engaging outreach caption from the provided polar research documents.
Rules:
1. "stat_text": A single punchy, high-impact scientific fact or statistic. MUST BE 15 WORDS OR FEWER (e.g., "-42°C Winter Record at Maitri Station" or "100m Ice Core Drilled in Central Dronning Maud Land").
2. "caption": An engaging, accessible 2-3 sentence outreach caption explaining the significance of the statistic for the public.
3. Grounding: All numbers, findings, locations, and dates MUST come directly from the provided source context. Never invent or hallucinate data.
4. Respond ONLY in valid JSON matching this schema:
{
  "stat_text": "Single key statistic (maximum 15 words)",
  "caption": "Engaging 2-3 sentence grounded outreach caption"
}`

	systemPrompt += "\n5. Language requirement: Write in clear, compelling English."

	userPrompt := fmt.Sprintf("Source Context:\n%s\n\nPlease extract the key stat and write the outreach caption in JSON format.", contextText)

	reqBody := GroqRequest{
		Model: getGroqModel(),
		Messages: []GroqMessage{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: userPrompt},
		},
		Temperature: 0.3,
		ResponseFormat: map[string]interface{}{
			"type": "json_object",
		},
	}

	var lastErr error
	maxRetries := 2
	for attempt := 0; attempt <= maxRetries; attempt++ {
		rawResponse, err := executeGroqCall(apiKey, reqBody)
		if err != nil {
			lastErr = err
			continue
		}

		var result SocialCardAIOutput
		if err := json.Unmarshal([]byte(rawResponse), &result); err != nil {
			lastErr = fmt.Errorf("JSON parse failure: %w", err)
			reqBody.Messages = append(reqBody.Messages,
				GroqMessage{Role: "assistant", Content: rawResponse},
				GroqMessage{Role: "user", Content: "Your previous response was not valid JSON. Please reply with ONLY valid JSON matching the exact schema."},
			)
			continue
		}

		// Enforce max 15 words on stat_text per plan §1.3
		words := strings.Fields(strings.TrimSpace(result.StatText))
		if len(words) > 15 {
			result.StatText = strings.Join(words[:15], " ")
		}

		return &result, nil
	}

	return nil, fmt.Errorf("failed to generate social card after retries: %w", lastErr)
}

// GenerateLessonPlan creates a curriculum-aligned lesson plan structured into teacher brief,
// 3 discussion questions, and 1 hands-on experiment, strictly grounded in research context.
func GenerateLessonPlan(
	contextText string,
	class int,
	subject string,
	concept string,
	validResourceIDs []string,
) (*models.LessonPlanStructure, bool, []string, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return nil, false, nil, fmt.Errorf("GROQ_API_KEY environment variable is not set")
	}

	systemPrompt := fmt.Sprintf(`You are Aicygram Education AI, an expert at creating curriculum-aligned lesson plans for Indian school students using real polar and ocean research data.

TARGET CURRICULUM:
- Class: %d
- Subject: %s
- Concept: %s

RULES:
1. Use ONLY the provided source material for all factual claims.
2. Every fact MUST include a source citation in the format {"id": "SOURCE_ID", "title": "SOURCE_TITLE"} where SOURCE_ID is one of the resource IDs provided in the source context.
3. Never fabricate statistics, dates, author names, or source references.
4. Make content age-appropriate for Class %d students.
5. The experiment must use simple, safe materials available in a typical Indian school or home.
6. Align with NEP 2020 principles: experiential learning, interdisciplinary thinking, inquiry-based approach.

OUTPUT FORMAT: Respond with ONLY valid JSON matching this schema:
{
  "teacher_brief": {
    "content": "5-minute briefing for the teacher (100-250 words explaining how this polar research illustrates the curriculum concept)",
    "duration_minutes": 5,
    "sources": [{"id": "SOURCE_ID", "title": "SOURCE_TITLE"}]
  },
  "discussion_questions": [
    {
      "question": "Inquiry question for classroom discussion",
      "answer": "Source-grounded answer (50-80 words)",
      "sources": [{"id": "SOURCE_ID", "title": "SOURCE_TITLE"}]
    },
    {
      "question": "Second inquiry question",
      "answer": "Source-grounded answer (50-80 words)",
      "sources": [{"id": "SOURCE_ID", "title": "SOURCE_TITLE"}]
    },
    {
      "question": "Third inquiry question connecting to real-world impacts",
      "answer": "Source-grounded answer (50-80 words)",
      "sources": [{"id": "SOURCE_ID", "title": "SOURCE_TITLE"}]
    }
  ],
  "experiment": {
    "title": "Hands-on Demonstration / Experiment Title",
    "materials": ["Material 1", "Material 2", "Material 3"],
    "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "connection": "How this activity directly connects to the real polar research",
    "sources": [{"id": "SOURCE_ID", "title": "SOURCE_TITLE"}]
  }
}`, class, subject, concept, class)

	systemPrompt += "\n7. Language requirement: Write in clear, engaging, age-appropriate English."

	userPrompt := fmt.Sprintf("Source Context:\n%s\n\nTarget Curriculum:\nClass: %d | Subject: %s | Concept: %s\n\nPlease generate the lesson plan in JSON format based strictly on the source material.", contextText, class, subject, concept)

	reqBody := GroqRequest{
		Model: getGroqModel(),
		Messages: []GroqMessage{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: userPrompt},
		},
		Temperature: 0.3,
		ResponseFormat: map[string]interface{}{
			"type": "json_object",
		},
	}

	var lastErr error
	maxRetries := 2
	for attempt := 0; attempt <= maxRetries; attempt++ {
		rawResponse, err := executeGroqCall(apiKey, reqBody)
		if err != nil {
			lastErr = err
			continue
		}

		var plan models.LessonPlanStructure
		if err := json.Unmarshal([]byte(rawResponse), &plan); err != nil {
			lastErr = fmt.Errorf("JSON parse failure: %w", err)
			reqBody.Messages = append(reqBody.Messages,
				GroqMessage{Role: "assistant", Content: rawResponse},
				GroqMessage{Role: "user", Content: "Your previous response was not valid JSON. Please reply with ONLY valid JSON matching the exact schema without any commentary."},
			)
			continue
		}

		// Validate structure and citations
		citationValid, warnings := ValidateLessonPlan(&plan, validResourceIDs)
		return &plan, citationValid, warnings, nil
	}

	return nil, false, nil, fmt.Errorf("failed to generate lesson plan after retries: %w", lastErr)
}

// ValidateLessonPlan checks structural completeness and validates that cited source IDs exist in validResourceIDs.
// Returns (citationValid, warnings). If a non-existent source is cited, citationValid is false.
func ValidateLessonPlan(plan *models.LessonPlanStructure, validResourceIDs []string) (bool, []string) {
	validMap := make(map[string]bool)
	for _, id := range validResourceIDs {
		validMap[strings.TrimSpace(strings.ToUpper(id))] = true
	}

	var warnings []string
	allValid := true

	validateSources := func(sectionName string, sources []models.PlanSource) {
		if len(sources) == 0 {
			warnings = append(warnings, fmt.Sprintf("%s: missing citation", sectionName))
			allValid = false
			return
		}
		for _, s := range sources {
			cleanID := strings.TrimSpace(strings.ToUpper(s.ID))
			if cleanID == "" || !validMap[cleanID] {
				allValid = false
				warnings = append(warnings, fmt.Sprintf("%s: cited non-existent resource '%s'", sectionName, s.ID))
			}
		}
	}

	// 1. Teacher Brief check
	if strings.TrimSpace(plan.TeacherBrief.Content) == "" {
		allValid = false
		warnings = append(warnings, "teacher_brief: missing content")
	}
	if plan.TeacherBrief.DurationMinutes <= 0 {
		plan.TeacherBrief.DurationMinutes = 5
	}
	validateSources("teacher_brief", plan.TeacherBrief.Sources)

	// 2. Discussion Questions check
	if len(plan.DiscussionQuestions) == 0 {
		allValid = false
		warnings = append(warnings, "discussion_questions: empty list")
	}
	for i, q := range plan.DiscussionQuestions {
		if strings.TrimSpace(q.Question) == "" || strings.TrimSpace(q.Answer) == "" {
			allValid = false
			warnings = append(warnings, fmt.Sprintf("discussion_questions[%d]: incomplete question or answer", i))
		}
		validateSources(fmt.Sprintf("discussion_questions[%d]", i), q.Sources)
	}

	// 3. Experiment check
	if strings.TrimSpace(plan.Experiment.Title) == "" {
		allValid = false
		warnings = append(warnings, "experiment: missing title")
	}
	if len(plan.Experiment.Materials) == 0 {
		allValid = false
		warnings = append(warnings, "experiment: missing materials")
	}
	if len(plan.Experiment.Steps) == 0 {
		allValid = false
		warnings = append(warnings, "experiment: missing steps")
	}
	validateSources("experiment", plan.Experiment.Sources)

	return allValid, warnings
}

func executeGroqCall(apiKey string, reqBody GroqRequest) (string, error) {
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("groq API failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var groqResp GroqResponse
	if err := json.NewDecoder(resp.Body).Decode(&groqResp); err != nil {
		return "", err
	}

	if len(groqResp.Choices) == 0 {
		return "", fmt.Errorf("no response choices returned from Groq")
	}

	return groqResp.Choices[0].Message.Content, nil
}

func validateCitations(text string, validSourceIDs []string) string {
	validMap := make(map[string]bool)
	for _, id := range validSourceIDs {
		validMap[strings.TrimSpace(strings.ToUpper(id))] = true
	}

	re := regexp.MustCompile(`\[Source:\s*([^\]]+)\]`)
	return re.ReplaceAllStringFunc(text, func(match string) string {
		submatches := re.FindStringSubmatch(match)
		if len(submatches) > 1 {
			id := strings.TrimSpace(strings.ToUpper(submatches[1]))
			if validMap[id] {
				return fmt.Sprintf("[Source: %s]", id)
			}
		}
		return "[Source: Unverified]"
	})
}
