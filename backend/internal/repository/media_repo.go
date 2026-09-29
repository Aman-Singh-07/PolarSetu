package repository

import (
	"Aicygram/internal/models"
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type MediaRepo struct {
	pool *pgxpool.Pool
}

func NewMediaRepo(pool *pgxpool.Pool) *MediaRepo {
	return &MediaRepo{pool: pool}
}

// ListAll returns all media items joined with resource metadata.
func (r *MediaRepo) ListAll(ctx context.Context) ([]models.Media, error) {
	query := `
		SELECT
			m.id,
			COALESCE(m.resource_id, ''),
			COALESCE(m.media_type, 'PHOTO'),
			COALESCE(m.url, ''),
			COALESCE(m.caption, ''),
			COALESCE(m.attribution, ''),
			COALESCE(r.title, m.caption, 'Polar Specimen'),
			COALESCE(r.description, m.caption, ''),
			COALESCE(r.year, 2024),
			COALESCE(r.region, 'Polar Regions'),
			COALESCE(e.name, '')
		FROM media m
		LEFT JOIN resources r ON m.resource_id = r.id
		LEFT JOIN resource_expedition re ON r.id = re.resource_id
		LEFT JOIN expeditions e ON re.expedition_id = e.id
		ORDER BY m.id DESC
	`
	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var media []models.Media
	for rows.Next() {
		var m models.Media
		if err := rows.Scan(
			&m.ID,
			&m.ResourceID,
			&m.MediaType,
			&m.URL,
			&m.Caption,
			&m.Attribution,
			&m.Title,
			&m.Description,
			&m.Year,
			&m.Region,
			&m.ExpeditionID,
		); err != nil {
			return nil, err
		}
		m.Type = m.MediaType
		m.ThumbnailURL = m.URL
		media = append(media, m)
	}
	return media, rows.Err()
}

// GetByID returns a single media item by ID.
func (r *MediaRepo) GetByID(ctx context.Context, id int) (*models.Media, error) {
	query := `
		SELECT
			m.id,
			COALESCE(m.resource_id, ''),
			COALESCE(m.media_type, 'PHOTO'),
			COALESCE(m.url, ''),
			COALESCE(m.caption, ''),
			COALESCE(m.attribution, ''),
			COALESCE(r.title, m.caption, 'Polar Specimen'),
			COALESCE(r.description, m.caption, ''),
			COALESCE(r.year, 2024),
			COALESCE(r.region, 'Polar Regions'),
			COALESCE(e.name, '')
		FROM media m
		LEFT JOIN resources r ON m.resource_id = r.id
		LEFT JOIN resource_expedition re ON r.id = re.resource_id
		LEFT JOIN expeditions e ON re.expedition_id = e.id
		WHERE m.id = $1
	`
	var m models.Media
	if err := r.pool.QueryRow(ctx, query, id).Scan(
		&m.ID,
		&m.ResourceID,
		&m.MediaType,
		&m.URL,
		&m.Caption,
		&m.Attribution,
		&m.Title,
		&m.Description,
		&m.Year,
		&m.Region,
		&m.ExpeditionID,
	); err != nil {
		return nil, err
	}
	m.Type = m.MediaType
	m.ThumbnailURL = m.URL
	return &m, nil
}
