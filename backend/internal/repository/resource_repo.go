package repository

import (
	"context"
	"fmt"

	"PolarSetu/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ResourceRepo struct {
	pool *pgxpool.Pool
}

func NewResourceRepo(pool *pgxpool.Pool) *ResourceRepo {
	return &ResourceRepo{pool: pool}
}

// ListAll returns resources matching the given criteria.
func (r *ResourceRepo) ListAll(ctx context.Context, resType, region string, year int, status string) ([]models.Resource, error) {
	query := `SELECT id, type, title, description, year, region, source_url, storage_path, license, status, created_at FROM resources WHERE 1=1`
	args := []interface{}{}
	argIdx := 1

	if resType != "" {
		query += fmt.Sprintf(" AND type = $%d", argIdx)
		args = append(args, resType)
		argIdx++
	}
	if region != "" {
		query += fmt.Sprintf(" AND region = $%d", argIdx)
		args = append(args, region)
		argIdx++
	}
	if year > 0 {
		query += fmt.Sprintf(" AND year = $%d", argIdx)
		args = append(args, year)
		argIdx++
	}
	if status != "" {
		query += fmt.Sprintf(" AND status = $%d", argIdx)
		args = append(args, status)
		argIdx++
	}

	query += " ORDER BY created_at DESC"

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var resources []models.Resource
	for rows.Next() {
		var res models.Resource
		if err := rows.Scan(&res.ID, &res.Type, &res.Title, &res.Description,
			&res.Year, &res.Region, &res.SourceURL, &res.StoragePath,
			&res.License, &res.Status, &res.CreatedAt); err != nil {
			return nil, err
		}
		resources = append(resources, res)
	}
	return resources, rows.Err()
}

// GetByID returns a single resource by ID.
func (r *ResourceRepo) GetByID(ctx context.Context, id string) (*models.Resource, error) {
	var res models.Resource
	query := `SELECT id, type, title, description, year, region, source_url, storage_path, license, status, created_at FROM resources WHERE id = $1`
	err := r.pool.QueryRow(ctx, query, id).Scan(&res.ID, &res.Type, &res.Title, &res.Description,
		&res.Year, &res.Region, &res.SourceURL, &res.StoragePath,
		&res.License, &res.Status, &res.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &res, nil
}

// GetExpeditionsByResourceID returns expeditions linked to a resource.
func (r *ResourceRepo) GetExpeditionsByResourceID(ctx context.Context, resourceID string) ([]models.Expedition, error) {
	query := `
		SELECT e.id, e.name, e.region, e.year, e.start_date, e.end_date, e.objective, e.latitude, e.longitude, e.source_url, e.created_at
		FROM expeditions e
		JOIN resource_expedition re ON e.id = re.expedition_id
		WHERE re.resource_id = $1
		ORDER BY e.year DESC
	`
	rows, err := r.pool.Query(ctx, query, resourceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expeditions []models.Expedition
	for rows.Next() {
		var e models.Expedition
		if err := rows.Scan(&e.ID, &e.Name, &e.Region, &e.Year, &e.StartDate, &e.EndDate, &e.Objective, &e.Latitude, &e.Longitude, &e.SourceURL, &e.CreatedAt); err != nil {
			return nil, err
		}
		expeditions = append(expeditions, e)
	}
	return expeditions, rows.Err()
}

// Create inserts a new resource.
func (r *ResourceRepo) Create(ctx context.Context, req models.CreateResourceRequest) (*models.Resource, error) {
	var res models.Resource
	query := `
		INSERT INTO resources (id, type, title, description, year, region, source_url, license, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'DRAFT')
		RETURNING id, type, title, description, year, region, source_url, storage_path, license, status, created_at
	`
	err := r.pool.QueryRow(ctx, query, req.ID, req.Type, req.Title, req.Description,
		req.Year, req.Region, req.SourceURL, req.License).
		Scan(&res.ID, &res.Type, &res.Title, &res.Description,
			&res.Year, &res.Region, &res.SourceURL, &res.StoragePath,
			&res.License, &res.Status, &res.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &res, nil
}

// UpdateStoragePath updates an existing resource with a permanent file link.
func (r *ResourceRepo) UpdateStoragePath(ctx context.Context, id string, storagePath string) error {
	query := `UPDATE resources SET storage_path = $1 WHERE id = $2`
	_, err := r.pool.Exec(ctx, query, storagePath, id)
	return err
}
