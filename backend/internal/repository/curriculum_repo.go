package repository

import (
	"context"
	"fmt"

	"PolarSetu/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CurriculumRepo struct {
	pool *pgxpool.Pool
}

func NewCurriculumRepo(pool *pgxpool.Pool) *CurriculumRepo {
	return &CurriculumRepo{pool: pool}
}

// ListConcepts returns curriculum concepts matching the class and/or subject filters.
func (r *CurriculumRepo) ListConcepts(ctx context.Context, class int, subject string) ([]models.CurriculumConcept, error) {
	query := `SELECT id, class, subject, concept, nep_tags, COALESCE(description, '') FROM curriculum_concepts WHERE 1=1`
	args := []interface{}{}
	argIdx := 1

	if class > 0 {
		query += fmt.Sprintf(" AND class = $%d", argIdx)
		args = append(args, class)
		argIdx++
	}

	if subject != "" {
		query += fmt.Sprintf(" AND subject ILIKE $%d", argIdx)
		args = append(args, subject)
		argIdx++
	}

	query += " ORDER BY class ASC, subject ASC, id ASC"

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query curriculum concepts: %w", err)
	}
	defer rows.Close()

	var concepts []models.CurriculumConcept
	for rows.Next() {
		var c models.CurriculumConcept
		if err := rows.Scan(&c.ID, &c.Class, &c.Subject, &c.Concept, &c.NEPTags, &c.Description); err != nil {
			return nil, fmt.Errorf("failed to scan curriculum concept: %w", err)
		}
		if c.NEPTags == nil {
			c.NEPTags = []string{}
		}
		concepts = append(concepts, c)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return concepts, nil
}

// GetConceptByID returns a single concept by primary key ID.
func (r *CurriculumRepo) GetConceptByID(ctx context.Context, id int) (*models.CurriculumConcept, error) {
	query := `SELECT id, class, subject, concept, nep_tags, COALESCE(description, '') FROM curriculum_concepts WHERE id = $1`
	var c models.CurriculumConcept
	err := r.pool.QueryRow(ctx, query, id).Scan(&c.ID, &c.Class, &c.Subject, &c.Concept, &c.NEPTags, &c.Description)
	if err != nil {
		return nil, err
	}
	if c.NEPTags == nil {
		c.NEPTags = []string{}
	}
	return &c, nil
}

// GetResourcesByConceptID retrieves all polar research resources linked to a curriculum concept.
func (r *CurriculumRepo) GetResourcesByConceptID(ctx context.Context, conceptID int) ([]models.Resource, error) {
	query := `
		SELECT r.id, r.type, r.title, COALESCE(r.description, ''), r.year, r.region,
		       COALESCE(r.source_url, ''), COALESCE(r.storage_path, ''), COALESCE(r.license, ''),
		       COALESCE(r.status, 'CATALOGUED'), r.created_at
		FROM resources r
		JOIN resource_curriculum_tags rct ON r.id = rct.resource_id
		WHERE rct.concept_id = $1
		ORDER BY r.year DESC, r.created_at DESC`

	rows, err := r.pool.Query(ctx, query, conceptID)
	if err != nil {
		return nil, fmt.Errorf("failed to query resources for concept %d: %w", conceptID, err)
	}
	defer rows.Close()

	var resources []models.Resource
	for rows.Next() {
		var res models.Resource
		if err := rows.Scan(
			&res.ID, &res.Type, &res.Title, &res.Description, &res.Year, &res.Region,
			&res.SourceURL, &res.StoragePath, &res.License, &res.Status, &res.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan resource: %w", err)
		}
		resources = append(resources, res)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return resources, nil
}

// TagResourceToConcept associates a research resource with a curriculum concept.
func (r *CurriculumRepo) TagResourceToConcept(ctx context.Context, resourceID string, conceptID int) error {
	query := `INSERT INTO resource_curriculum_tags (resource_id, concept_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`
	_, err := r.pool.Exec(ctx, query, resourceID, conceptID)
	if err != nil {
		return fmt.Errorf("failed to tag resource %s to concept %d: %w", resourceID, conceptID, err)
	}
	return nil
}

// UntagResourceFromConcept removes the association between a resource and concept.
func (r *CurriculumRepo) UntagResourceFromConcept(ctx context.Context, resourceID string, conceptID int) error {
	query := `DELETE FROM resource_curriculum_tags WHERE resource_id = $1 AND concept_id = $2`
	_, err := r.pool.Exec(ctx, query, resourceID, conceptID)
	if err != nil {
		return fmt.Errorf("failed to untag resource %s from concept %d: %w", resourceID, conceptID, err)
	}
	return nil
}

// ListLessonPlans retrieves all lesson plans stored in ai_generations with optional class filter.
func (r *CurriculumRepo) ListLessonPlans(ctx context.Context, class int) ([]models.AIGeneration, error) {
	query := `
		SELECT id, user_id, source_ids, audience, output_type, content, status, created_at, COALESCE(metadata, '{}'::jsonb)
		FROM ai_generations
		WHERE output_type = 'Lesson Plan'
	`
	var rows pgx.Rows
	var err error
	if class > 0 {
		query += ` AND (metadata->>'class')::int = $1 ORDER BY created_at DESC`
		rows, err = r.pool.Query(ctx, query, class)
	} else {
		query += ` ORDER BY created_at DESC`
		rows, err = r.pool.Query(ctx, query)
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query lesson plans: %w", err)
	}
	defer rows.Close()

	var plans []models.AIGeneration
	for rows.Next() {
		var g models.AIGeneration
		if err := rows.Scan(&g.ID, &g.UserID, &g.SourceIDs, &g.Audience, &g.OutputType, &g.Content, &g.Status, &g.CreatedAt, &g.Metadata); err != nil {
			return nil, fmt.Errorf("failed to scan lesson plan: %w", err)
		}
		plans = append(plans, g)
	}
	return plans, rows.Err()
}
