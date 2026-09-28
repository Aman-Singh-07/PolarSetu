package routes

import (
	"PolarSetu/internal/config"
	"PolarSetu/internal/handlers"
	"PolarSetu/internal/middleware"
	"PolarSetu/internal/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Setup(pool *pgxpool.Pool, cfg *config.Config) *gin.Engine {
	r := gin.Default()

	// Implement strict CORS for frontend-backend handshake
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"}, // Vite/React defaults
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Repos
	userRepo := repository.NewUserRepo(pool)
	expeditionRepo := repository.NewExpeditionRepo(pool)
	resourceRepo := repository.NewResourceRepo(pool)
	mediaRepo := repository.NewMediaRepo(pool)
	activityRepo := repository.NewActivityRepo(pool)
	searchRepo := repository.NewSearchRepo(pool)
	reviewRepo := repository.NewReviewRepo(pool)
	provenanceRepo := repository.NewProvenanceRepo(pool)

	// Handlers
	authHandler := handlers.NewAuthHandler(userRepo, cfg.JWTSecret)
	expeditionHandler := handlers.NewExpeditionHandler(expeditionRepo)
	resourceHandler := handlers.NewResourceHandler(resourceRepo)
	mediaHandler := handlers.NewMediaHandler(mediaRepo)
	activityHandler := handlers.NewActivityHandler(activityRepo)
	searchHandler := handlers.NewSearchHandler(searchRepo, resourceRepo)
	reviewHandler := handlers.NewReviewHandler(reviewRepo)
	aiHandler := handlers.NewAIHandler(resourceRepo, reviewRepo)
	provenanceHandler := handlers.NewProvenanceHandler(provenanceRepo)

	api := r.Group("/api")
	{
		api.GET("/health", handlers.HealthCheck)
		api.POST("/auth/login", authHandler.Login)

		// Public Expedition Routes
		api.GET("/expeditions", expeditionHandler.List)
		api.GET("/expeditions/:id", expeditionHandler.GetByID)

		// Public Resource Routes
		api.GET("/resources", resourceHandler.List)
		api.GET("/resources/:id", resourceHandler.GetByID)
		api.GET("/resources/:id/relations", provenanceHandler.GetRelations)

		// Public Media & Activity Routes
		api.GET("/media", mediaHandler.List)
		api.GET("/activities", activityHandler.List)

		// Search Route
		api.GET("/search", searchHandler.Search)

		// AI Q&A (Read-only generation is usually open)
		api.POST("/ai/ask", aiHandler.Ask)

		// Protected Routes
		// (Requires a valid JWT Bearer Token generated from /api/auth/login)
		protected := api.Group("")
		protected.Use(middleware.AuthRequired(cfg.JWTSecret))
		{
			// Admin Governance & Review Queue (Mutations must be secured)
			protected.GET("/review/queue", reviewHandler.GetQueue)
			protected.POST("/review/:id/approve", reviewHandler.ApproveDraft)
			protected.POST("/review/:id/reject", reviewHandler.RejectDraft)

			// AI Generation Write Routes
			protected.POST("/ai/outreach", aiHandler.GenerateOutreach)

			// General Create Actions
			protected.POST("/expeditions", expeditionHandler.Create)
			protected.POST("/resources", resourceHandler.Create)

			// Storage & Data Flow Mutations
			protected.POST("/resources/:id/upload", resourceHandler.UploadFile)
			protected.POST("/resources/:id/relations", provenanceHandler.CreateRelation)
		}
		return r
	}
}
