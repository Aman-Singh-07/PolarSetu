package repository

import (
	"context"
	"PolarSetu/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ActivityRepo struct {
	pool *pgxpool.Pool
}

func NewActivityRepo(pool *pgxpool.Pool) *ActivityRepo {
	return &ActivityRepo{pool: pool}
}

// ListAll returns all institutional activities.
func (r *ActivityRepo) ListAll(ctx context.Context) ([]models.Activity, error) {
	query := `SELECT id, title, date, description, source_url, media_url, created_at FROM activities ORDER BY date DESC NULLS LAST`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []models.Activity
	for rows.Next() {
		var a models.Activity
		if err := rows.Scan(&a.ID, &a.Title, &a.Date, &a.Description, &a.SourceURL, &a.MediaURL, &a.CreatedAt); err != nil {
			return nil, err
		}
		activities = append(activities, a)
	}
	return activities, rows.Err()
}
