package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"Aicygram/internal/config"
	"Aicygram/internal/db"
	"Aicygram/internal/routes"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found. Reading config from environment variables.")
	}

	cfg := config.LoadConfig()

	// Use original ConnectDB from internal/db
	db.ConnectDB()
	pool := db.Pool // Extract the constructed pool to pass to our router bindings

	r := routes.Setup(pool, cfg)

	// Create a native Go http server rather than using Gin's blocking Run() directly
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: r,
	}

	// Initializing the server in a goroutine so that it won't block the graceful shutdown handling
	go func() {
		log.Printf("Server starting on port %s\n", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server & database
	quit := make(chan os.Signal, 1)

	// kill (no param) default send syscanll.SIGTERM
	// kill -2 is syscall.SIGINT (Ctrl+C)
	// kill -9 is syscall. SIGKILL (can't be catch, so don't add it)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown Signal Received. Commencing graceful shutdown of Aicygram Backend...")

	// Create a deadline to wait for active HTTP requests to finish
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown error:", err)
	}

	// Close the DB connection pools gracefully
	log.Println("Closing PostgreSQL connection pool...")
	pool.Close()

	log.Println("Server exiting gracefully. Goodbye.")
}
