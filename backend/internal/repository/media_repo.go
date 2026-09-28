package repository

import (
	"PolarSetu/internal/models"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

type MediaRepo struct {
	pool *pgxpool.Pool
}

func NewMediaRepo(pool *pgxpool.Pool) *MediaRepo {
	return &MediaRepo{pool: pool}
}

// ListAll returns all media items.
func (r *MediaRepo) ListAll(ctx context.Context) ([]models.Media, error) {
	query := `SELECT id, resource_id, media_type, url, caption, attribution FROM media ORDER BY id DESC`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var media []models.Media
	for rows.Next() {
		var m models.Media
		if err := rows.Scan(&m.ID, &m.ResourceID, &m.MediaType, &m.URL, &m.Caption, &m.Attribution); err != nil {
			return nil, err
		}
		media = append(media, m)
	}
	return media, rows.Err()
}
