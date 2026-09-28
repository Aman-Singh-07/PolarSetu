package db

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Pool holds the connection to the database
var Pool *pgxpool.Pool

func ConnectDB() {
	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	var err error
	Pool, err = pgxpool.New(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v\n", err)
	}

	// Test the connection
	if err := Pool.Ping(context.Background()); err != nil {
		log.Fatalf("Unable to ping the database: %v\n", err)
	}

	log.Println("Successfully connected to the PostgreSQL database")
}
