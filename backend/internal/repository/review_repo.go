package repository

import (
	"context"

	"PolarSetu/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ReviewRepo struct {
	pool *pgxpool.Pool
}

func NewReviewRepo(pool *pgxpool.Pool) *ReviewRepo {
	return &ReviewRepo{pool: pool}
}

// GetPendingQueue returns all AI generations currently in DRAFT status.
func (r *ReviewRepo) GetPendingQueue(ctx context.Context) ([]models.AIGeneration, error) {
	query := `
		SELECT id, user_id, source_ids, audience, output_type, content, status, created_at 
		FROM ai_generations 
		WHERE status = 'DRAFT' 
		ORDER BY created_at DESC
	`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var queue []models.AIGeneration
	for rows.Next() {
		var g models.AIGeneration
		if err := rows.Scan(&g.ID, &g.UserID, &g.SourceIDs, &g.Audience, &g.OutputType, &g.Content, &g.Status, &g.CreatedAt); err != nil {
			return nil, err
		}
		queue = append(queue, g)
	}
	return queue, rows.Err()
}

// UpdateStatus changes a draft to APPROVED or REJECTED.
func (r *ReviewRepo) UpdateStatus(ctx context.Context, id int, status string) error {
	query := `UPDATE ai_generations SET status = $1 WHERE id = $2`
	_, err := r.pool.Exec(ctx, query, status, id)
	return err
}

// SaveDraft inserts a new AI generation straight into the draft queue.
func (r *ReviewRepo) SaveDraft(ctx context.Context, draft models.AIGeneration) (*models.AIGeneration, error) {
	var g models.AIGeneration
	query := `
		INSERT INTO ai_generations (user_id, source_ids, audience, output_type, content, status)
		VALUES ($1, $2, $3, $4, $5, 'DRAFT')
		RETURNING id, user_id, source_ids, audience, output_type, content, status, created_at
	`
	err := r.pool.QueryRow(ctx, query, draft.UserID, draft.SourceIDs, draft.Audience, draft.OutputType, draft.Content).
		Scan(&g.ID, &g.UserID, &g.SourceIDs, &g.Audience, &g.OutputType, &g.Content, &g.Status, &g.CreatedAt)

	if err != nil {
		return nil, err
	}
	return &g, nil
}
