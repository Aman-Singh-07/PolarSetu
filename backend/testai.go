package main

import (
	"PolarSetu/internal/services"
	"fmt"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load(".env")
	contextData := "[Source ID: RPT-2024-001] Official technical report covering the first winter-phase operations in the Arctic."

	fmt.Println("Asking AI...")
	answer, err := services.AskPolarSetu("What is this report about?", contextData, []string{"RPT-2024-001"})
	if err != nil {
		fmt.Println("ERROR:", err)
		return
	}
	fmt.Println("AI ANSWER:", answer)
}
