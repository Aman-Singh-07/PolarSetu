package repository

import (
	"context"

	"PolarSetu/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ProvenanceRepo struct {
	pool *pgxpool.Pool
}

func NewProvenanceRepo(pool *pgxpool.Pool) *ProvenanceRepo {
	return &ProvenanceRepo{pool: pool}
}

// GetRelatedResources fetches the graph edges mapping how a resource links to others.
func (r *ProvenanceRepo) GetRelatedResources(ctx context.Context, resourceID string) ([]models.ResourceRelation, error) {
	query := `
		SELECT from_resource_id, to_resource_id, relation_type
		FROM resource_relations
		WHERE from_resource_id = $1 OR to_resource_id = $1
	`
	rows, err := r.pool.Query(ctx, query, resourceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var relations []models.ResourceRelation
	for rows.Next() {
		var rel models.ResourceRelation
		if err := rows.Scan(&rel.FromResourceID, &rel.ToResourceID, &rel.RelationType); err != nil {
			return nil, err
		}
		relations = append(relations, rel)
	}
	return relations, rows.Err()
}

// CreateRelation inserts a new graph link outlining provenance (e.g. DATASET was generated from REPORT).
func (r *ProvenanceRepo) CreateRelation(ctx context.Context, rel models.ResourceRelation) error {
	query := `
		INSERT INTO resource_relations (from_resource_id, to_resource_id, relation_type)
		VALUES ($1, $2, $3)
		ON CONFLICT DO NOTHING
	`
	_, err := r.pool.Exec(ctx, query, rel.FromResourceID, rel.ToResourceID, rel.RelationType)
	return err
}
