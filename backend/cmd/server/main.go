package main

import (
	"log"

	"PolarSetu/internal/config"
	"PolarSetu/internal/db"
	"PolarSetu/internal/routes"
)

func main() {
	// 1. Load configuration
	cfg := config.Load()

	// 2. Connect to database
	db.ConnectDB()
	defer db.Pool.Close()

	// 3. Setup routes
	r := routes.Setup(db.Pool, cfg)

	// 4. Start server
	log.Printf("Server starting on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
