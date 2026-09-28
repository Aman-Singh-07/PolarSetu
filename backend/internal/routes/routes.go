package routes

import (
	"PolarSetu/internal/config"
	"PolarSetu/internal/handlers"
	"PolarSetu/internal/middleware"
	"PolarSetu/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Setup(pool *pgxpool.Pool, cfg *config.Config) *gin.Engine {
	r := gin.Default()

	// Repos
	userRepo := repository.NewUserRepo(pool)
	expeditionRepo := repository.NewExpeditionRepo(pool)
	resourceRepo := repository.NewResourceRepo(pool)
	mediaRepo := repository.NewMediaRepo(pool)
	activityRepo := repository.NewActivityRepo(pool)
	searchRepo := repository.NewSearchRepo(pool)
	reviewRepo := repository.NewReviewRepo(pool)
	provenanceRepo := repository.NewProvenanceRepo(pool) // New Repository Instance

	// Handlers
	authHandler := handlers.NewAuthHandler(userRepo, cfg.JWTSecret)
	expeditionHandler := handlers.NewExpeditionHandler(expeditionRepo)
	resourceHandler := handlers.NewResourceHandler(resourceRepo)
	mediaHandler := handlers.NewMediaHandler(mediaRepo)
	activityHandler := handlers.NewActivityHandler(activityRepo)
	searchHandler := handlers.NewSearchHandler(searchRepo, resourceRepo)
	reviewHandler := handlers.NewReviewHandler(reviewRepo)
	aiHandler := handlers.NewAIHandler(resourceRepo, reviewRepo)
	provenanceHandler := handlers.NewProvenanceHandler(provenanceRepo) // New Handler Instance

	// CORS config could be mapped here for Step 1 of phase 6

	api := r.Group("/api")
	{
		api.GET("/health", handlers.HealthCheck)
		api.POST("/auth/login", authHandler.Login)

		// Expedition Routes
		api.GET("/expeditions", expeditionHandler.List)
		api.GET("/expeditions/:id", expeditionHandler.GetByID)

		// Resource Routes
		api.GET("/resources", resourceHandler.List)
		api.GET("/resources/:id", resourceHandler.GetByID)
		api.GET("/resources/:id/relations", provenanceHandler.GetRelations)

		// Media & Activity Routes
		api.GET("/media", mediaHandler.List)
		api.GET("/activities", activityHandler.List)

		// Search Route
		api.GET("/search", searchHandler.Search)

		// Unprotected Review Routes
		api.GET("/review/queue", reviewHandler.GetQueue)
		api.POST("/review/:id/approve", reviewHandler.ApproveDraft)
		api.POST("/review/:id/reject", reviewHandler.RejectDraft)

		// AI Generation Routes
		api.POST("/ai/ask", aiHandler.Ask)
		api.POST("/ai/outreach", aiHandler.GenerateOutreach)

		protected := api.Group("")
		protected.Use(middleware.AuthRequired(cfg.JWTSecret))
		{
			protected.POST("/expeditions", expeditionHandler.Create)

			protected.POST("/resources", resourceHandler.Create)
			protected.POST("/resources/:id/upload", resourceHandler.UploadFile)
			protected.POST("/resources/:id/relations", provenanceHandler.CreateRelation)
		}
		return r
	}
}
