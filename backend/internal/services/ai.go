package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type GroqMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GroqRequest struct {
	Model          string                 `json:"model"`
	Messages       []GroqMessage          `json:"messages"`
	Temperature    float64                `json:"temperature"`
	ResponseFormat map[string]interface{} `json:"response_format,omitempty"` // for JSON mode
}

type GroqResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// AskPolarSetu executes a grounded Q&A against Groq.
func AskPolarSetu(question string, contextText string, sourceIds []string) (string, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GROQ_API_KEY environment variable is not set")
	}

	systemPrompt := `You are PolarSetu, a source-grounded polar-science assistant.
Rules:
1. Use ONLY the supplied evidence context for factual claims.
2. Never fabricate authors, dates, statistics, citations or page numbers.
3. When evidence is insufficient or irrelevant to the question, say "The available sources do not provide enough evidence." and stop executing.
4. Keep scientific uncertainty intact.`

	userPrompt := fmt.Sprintf("Context:\n%s\n\nQuestion: %s", contextText, question)

	reqBody := GroqRequest{
		Model: "openai/gpt-oss-120b",
		Messages: []GroqMessage{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: userPrompt},
		},
		Temperature: 0.1,
	}

	return executeGroqCall(apiKey, reqBody)
}

// GenerateOutreach instructs Groq to create a structured outreach draft using JSON mode.
func GenerateOutreach(contextText string, audience string, format string) (string, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GROQ_API_KEY environment variable is not set")
	}

	systemPrompt := `You are PolarSetu, an expert scientific communicator.
You are tasked with generating content specifically tailored for outreach.
You MUST respond in valid JSON format matching this schema:
{
  "title": "String - Catchy title",
  "summary": "String - 1 sentence summary",
  "content": "String - The full markdown formatted text",
  "audience": "String - The target audience"
}
Make sure all generated facts adhere closely to the provided context.`

	userPrompt := fmt.Sprintf("Context: %s\n\nTarget Audience: %s\nOutput Format: %s\n\nPlease generate the JSON.", contextText, audience, format)

	reqBody := GroqRequest{
		Model: "openai/gpt-oss-120b",
		Messages: []GroqMessage{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: userPrompt},
		},
		Temperature: 0.4,
		ResponseFormat: map[string]interface{}{
			"type": "json_object",
		},
	}

	return executeGroqCall(apiKey, reqBody)
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
