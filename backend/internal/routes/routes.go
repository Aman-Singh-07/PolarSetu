package routes

import (
	"Aicygram/internal/config"
	"Aicygram/internal/handlers"
	"Aicygram/internal/middleware"
	"Aicygram/internal/repository"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Setup(pool *pgxpool.Pool, cfg *config.Config) *gin.Engine {
	r := gin.Default()

	// CORS Setup
	allowedOrigins := []string{"http://localhost:5173", "http://127.0.0.1:5173"}
	if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Repositories
	userRepo := repository.NewUserRepo(pool)
	expeditionRepo := repository.NewExpeditionRepo(pool)
	resourceRepo := repository.NewResourceRepo(pool)
	mediaRepo := repository.NewMediaRepo(pool)
	activityRepo := repository.NewActivityRepo(pool)
	searchRepo := repository.NewSearchRepo(pool)
	reviewRepo := repository.NewReviewRepo(pool)
	provenanceRepo := repository.NewProvenanceRepo(pool)
	curriculumRepo := repository.NewCurriculumRepo(pool)

	// Handlers
	authHandler := handlers.NewAuthHandler(userRepo, cfg.JWTSecret)
	expeditionHandler := handlers.NewExpeditionHandler(expeditionRepo)
	resourceHandler := handlers.NewResourceHandler(resourceRepo)
	mediaHandler := handlers.NewMediaHandler(mediaRepo)
	activityHandler := handlers.NewActivityHandler(activityRepo)
	searchHandler := handlers.NewSearchHandler(searchRepo, resourceRepo)
	reviewHandler := handlers.NewReviewHandler(reviewRepo)
	aiHandler := handlers.NewAIHandler(resourceRepo, reviewRepo, searchRepo, mediaRepo, curriculumRepo)
	provenanceHandler := handlers.NewProvenanceHandler(provenanceRepo)
	curriculumHandler := handlers.NewCurriculumHandler(curriculumRepo, resourceRepo)

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

		// Curriculum Routes
		api.GET("/curriculum/concepts", curriculumHandler.ListConcepts)
		api.GET("/curriculum/concepts/:id/resources", curriculumHandler.GetResourcesForConcept)
		api.GET("/curriculum/lesson-plans", curriculumHandler.ListLessonPlans)
		api.POST("/curriculum/tags", curriculumHandler.TagResource)
		api.POST("/curriculum/concepts/:id/resources", curriculumHandler.TagResource)
		api.DELETE("/curriculum/concepts/:id/resources/:resourceId", curriculumHandler.UntagResource)

		// AI Q&A & Generation Routes
		api.POST("/ai/ask", aiHandler.Ask)
		api.POST("/ai/social-card", aiHandler.GenerateSocialCard)
		api.POST("/ai/social-card/:id/render", aiHandler.RenderSocialCard)
		api.POST("/ai/lesson-plan", aiHandler.GenerateLessonPlan)

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

			// Curriculum Tagging (Admin protected alternative)
			protected.POST("/admin/curriculum/tags", curriculumHandler.TagResource)
			protected.DELETE("/admin/curriculum/tags/:id/:resourceId", curriculumHandler.UntagResource)

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
