package repository

import (
	"context"
	"fmt"

	"PolarSetu/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ExpeditionRepo struct {
	pool *pgxpool.Pool
}

func NewExpeditionRepo(pool *pgxpool.Pool) *ExpeditionRepo {
	return &ExpeditionRepo{pool: pool}
}

// ListAll returns expeditions with optional region and year filters.
func (r *ExpeditionRepo) ListAll(ctx context.Context, region string, year int) ([]models.Expedition, error) {
	query := `SELECT id, name, region, year, start_date, end_date,
                     objective, latitude, longitude, source_url, created_at
              FROM expeditions WHERE 1=1`
	args := []interface{}{}
	argIdx := 1

	if region != "" {
		query += fmt.Sprintf(" AND LOWER(region) = LOWER($%d)", argIdx)
		args = append(args, region)
		argIdx++
	}
	if year > 0 {
		query += fmt.Sprintf(" AND year = $%d", argIdx)
		args = append(args, year)
		argIdx++
	}

	query += " ORDER BY year DESC, name ASC"

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expeditions []models.Expedition
	for rows.Next() {
		var e models.Expedition
		if err := rows.Scan(&e.ID, &e.Name, &e.Region, &e.Year,
			&e.StartDate, &e.EndDate, &e.Objective,
			&e.Latitude, &e.Longitude, &e.SourceURL, &e.CreatedAt); err != nil {
			return nil, err
		}
		expeditions = append(expeditions, e)
	}
	return expeditions, rows.Err()
}

// GetByID returns a single expedition by ID.
func (r *ExpeditionRepo) GetByID(ctx context.Context, id int) (*models.Expedition, error) {
	var e models.Expedition
	err := r.pool.QueryRow(ctx,
		`SELECT id, name, region, year, start_date, end_date,
                objective, latitude, longitude, source_url, created_at
         FROM expeditions WHERE id = $1`, id,
	).Scan(&e.ID, &e.Name, &e.Region, &e.Year,
		&e.StartDate, &e.EndDate, &e.Objective,
		&e.Latitude, &e.Longitude, &e.SourceURL, &e.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

// Create inserts a new expedition and returns it with the generated ID.
func (r *ExpeditionRepo) Create(ctx context.Context, req models.CreateExpeditionRequest) (*models.Expedition, error) {
	var e models.Expedition

	// Parse optional date strings
	var startDate, endDate interface{}
	if req.StartDate != "" {
		startDate = req.StartDate
	}
	if req.EndDate != "" {
		endDate = req.EndDate
	}

	err := r.pool.QueryRow(ctx,
		`INSERT INTO expeditions (name, region, year, start_date, end_date,
                                  objective, latitude, longitude, source_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, name, region, year, start_date, end_date,
                   objective, latitude, longitude, source_url, created_at`,
		req.Name, req.Region, req.Year, startDate, endDate,
		req.Objective, req.Latitude, req.Longitude, req.SourceURL,
	).Scan(&e.ID, &e.Name, &e.Region, &e.Year,
		&e.StartDate, &e.EndDate, &e.Objective,
		&e.Latitude, &e.Longitude, &e.SourceURL, &e.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

// GetResourcesByExpeditionID returns all resources linked to an expedition.
func (r *ExpeditionRepo) GetResourcesByExpeditionID(ctx context.Context, expeditionID int) ([]models.Resource, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT r.id, r.type, r.title, r.description, r.year, r.region,
                r.source_url, r.storage_path, r.license, r.status, r.created_at
         FROM resources r
         JOIN resource_expedition re ON r.id = re.resource_id
         WHERE re.expedition_id = $1
         ORDER BY r.year DESC`, expeditionID,
	)
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
