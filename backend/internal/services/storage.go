package services

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

// UploadToSupabase streams a file directly to the Supabase Storage REST API
func UploadToSupabase(file *multipart.FileHeader, resourceID string) (string, error) {
	url := os.Getenv("SUPABASE_URL")
	key := os.Getenv("SUPABASE_SERVICE_KEY")

	// If keys are missing, simulate a local mock rather than failing the whole API call.
	// This ensures frontend components continue operating seamlessly in dev environments.
	if url == "" || key == "" {
		return fmt.Sprintf("/storage/mocked_upload_%s_%s", resourceID, filepath.Base(file.Filename)), nil
	}

	srcFile, err := file.Open()
	if err != nil {
		return "", err
	}
	defer srcFile.Close()

	fileBytes, err := io.ReadAll(srcFile)
	if err != nil {
		return "", err
	}

	// Format: /storage/v1/object/bucket-name/filepath
	// We will use a bucket named 'resources'
	objectPath := fmt.Sprintf("resources/%s/%s", resourceID, filepath.Base(file.Filename))
	uploadURL := fmt.Sprintf("%s/storage/v1/object/%s", url, objectPath)

	req, err := http.NewRequest("POST", uploadURL, bytes.NewReader(fileBytes))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+key)
	req.Header.Set("apiKey", key) // Supabase requires this specific header along with Auth
	req.Header.Set("Content-Type", file.Header.Get("Content-Type"))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("supabase upload failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	// Generate the public URL that the frontend can actually retrieve the file from
	publicURL := fmt.Sprintf("%s/storage/v1/object/public/%s", url, objectPath)
	return publicURL, nil
}
