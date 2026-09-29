package models

import (
	"time"
)

// ─── Database Models ─────────────────────────────────────────

type User struct {
	ID           int       `json:"id,string"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"createdAt"`
}

type Expedition struct {
	ID        int        `json:"id,string"`
	Name      string     `json:"name"`
	Region    string     `json:"region"`
	Year      int        `json:"year"`
	StartDate *time.Time `json:"startDate"`
	EndDate   *time.Time `json:"endDate"`
	Objective string     `json:"objective"`
	Latitude  float64    `json:"latitude"`
	Longitude float64    `json:"longitude"`
	SourceURL string     `json:"sourceUrl"`
	CreatedAt time.Time  `json:"createdAt"`
}

type Resource struct {
	ID          string    `json:"id"`
	Type        string    `json:"type"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Year        int       `json:"year"`
	Region      string    `json:"region"`
	SourceURL   string    `json:"sourceUrl"`
	StoragePath string    `json:"storagePath"`
	License     string    `json:"license"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
}

type ResourceChunk struct {
	ID         int    `json:"id,string"`
	ResourceID string `json:"resourceId"`
	PageNumber *int   `json:"pageNumber"`
	Section    string `json:"section"`
	Content    string `json:"content"`
}

type ResourceExpedition struct {
	ResourceID   string `json:"resourceId"`
	ExpeditionID int    `json:"expeditionId,string"`
}

type ResourceRelation struct {
	FromResourceID string `json:"fromResourceId"`
	ToResourceID   string `json:"toResourceId"`
	RelationType   string `json:"relationType"`
}

type Activity struct {
	ID          int        `json:"id,string"`
	Title       string     `json:"title"`
	Date        *time.Time `json:"date"`
	Description string     `json:"description"`
	SourceURL   string     `json:"sourceUrl"`
	MediaURL    string     `json:"mediaUrl"`
	CreatedAt   time.Time  `json:"createdAt"`
}

type Media struct {
	ID           int    `json:"id,string"`
	ResourceID   string `json:"resourceId"`
	MediaType    string `json:"mediaType"`
	Type         string `json:"type"`
	URL          string `json:"url"`
	ThumbnailURL string `json:"thumbnailUrl"`
	Caption      string `json:"caption"`
	Attribution  string `json:"attribution"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	Year         int    `json:"year"`
	Region       string `json:"region"`
	ExpeditionID string `json:"expeditionId,omitempty"`
}

type AIGeneration struct {
	ID         int       `json:"id,string"`
	UserID     *int      `json:"userId,string"` // Can be null if system generated
	SourceIDs  []string  `json:"sourceIds"`
	Audience   string    `json:"audience"`
	OutputType string    `json:"outputType"`
	Content    string    `json:"content"`
	Status     string    `json:"status"` // DRAFT, APPROVED, REJECTED
	CreatedAt  time.Time `json:"createdAt"`
}

type AuditLog struct {
	ID         int       `json:"id,string"`
	ActorID    *int      `json:"actorId,string"`
	Action     string    `json:"action"`
	EntityType string    `json:"entityType"`
	EntityID   string    `json:"entityId"`
	CreatedAt  time.Time `json:"createdAt"`
}

// ─── API Request / Response Types ────────────────────────────

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type CreateExpeditionRequest struct {
	Name      string  `json:"name" binding:"required"`
	Region    string  `json:"region" binding:"required"`
	Year      int     `json:"year" binding:"required"`
	StartDate string  `json:"startDate"`
	EndDate   string  `json:"endDate"`
	Objective string  `json:"objective"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	SourceURL string  `json:"sourceUrl"`
}

type CreateResourceRequest struct {
	ID          string `json:"id" binding:"required"`
	Type        string `json:"type" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Year        int    `json:"year"`
	Region      string `json:"region"`
	SourceURL   string `json:"sourceUrl"`
	License     string `json:"license"`
}

// ExpeditionDetail wraps an expedition with its linked resources.
type ExpeditionDetail struct {
	Expedition
	Resources []Resource `json:"resources"`
}

// ResourceDetail wraps a resource with its linked expeditions.
type ResourceDetail struct {
	Resource
	Expeditions []Expedition `json:"expeditions"`
}

type SearchResponse struct {
	Query   string     `json:"query"`
	Results []Resource `json:"results"`
}

type ErrorResponse struct {
	Error struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}
