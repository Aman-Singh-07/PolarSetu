package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"PolarSetu/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type SearchRepo struct {
	pool *pgxpool.Pool
}

func NewSearchRepo(pool *pgxpool.Pool) *SearchRepo {
	return &SearchRepo{pool: pool}
}

// Search queries the resources table utilizing the tsvector GIN index.
func (r *SearchRepo) Search(ctx context.Context, searchQuery string, resourceType string, year int) ([]models.Resource, error) {
	// Base query leverages websearch_to_tsquery for full-text lookup and ts_rank for relevance sorting.
	query := `
		SELECT id, type, title, description, year, region, source_url, storage_path, license, status, created_at,
		ts_rank(search_vector, websearch_to_tsquery('english', $1)) as relevance
		FROM resources
		WHERE search_vector @@ websearch_to_tsquery('english', $1)
	`

	args := []interface{}{strings.TrimSpace(searchQuery)}
	argIdx := 2

	// Dynamic Filters
	if resourceType != "" {
		query += fmt.Sprintf(" AND type = $%d", argIdx)
		args = append(args, resourceType)
		argIdx++
	}
	if year > 0 {
		query += fmt.Sprintf(" AND year = $%d", argIdx)
		args = append(args, year)
		argIdx++
	}

	// Always order by highest text-match relevance first
	query += " ORDER BY relevance DESC"

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.Resource
	for rows.Next() {
		var res models.Resource
		var relevance float64 // Toss the rank integer safely, we only needed it for sorting
		var storagePathNull sql.NullString

		if err := rows.Scan(&res.ID, &res.Type, &res.Title, &res.Description,
			&res.Year, &res.Region, &res.SourceURL, &storagePathNull,
			&res.License, &res.Status, &res.CreatedAt, &relevance); err != nil {
			return nil, err
		}
		if storagePathNull.Valid {
			res.StoragePath = storagePathNull.String
		}
		results = append(results, res)
	}

	return results, rows.Err()
}
