package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	GroqAPIKey  string
	SupabaseURL string
	SupabaseKey string
}

func Load() *Config {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found. Reading config from environment variables.")
	}

	cfg := &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnvRequired("DATABASE_URL"),
		JWTSecret:   getEnvRequired("JWT_SECRET"),
		GroqAPIKey:  os.Getenv("GROQ_API_KEY"),
		SupabaseURL: os.Getenv("SUPABASE_URL"),
		SupabaseKey: os.Getenv("SUPABASE_KEY"),
	}

	return cfg
}

// LoadConfig is provided for compatibility
func LoadConfig() *Config {
	return Load()
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvRequired(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("Required environment variable %s is not set", key)
	}
	return v
}
