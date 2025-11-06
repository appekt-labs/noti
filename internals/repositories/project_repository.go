package repositories

import (
	"context"
	"log"

	"github.com/appekt-labs/noti/internals/models"
	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProjectRepository struct {
	db *pgxpool.Pool
}

func NewProjectRepository(db *pgxpool.Pool) *ProjectRepository {
	return &ProjectRepository{
		db,
	}
}

// create new project;
func (p *ProjectRepository) Create(ctx context.Context, name string, userId string) error {

	_, err := p.db.Exec(ctx, "INSERT INTO projects (name, user_id) VALUES ($1, $2)", name, userId)

	if err != nil {
		log.Println("error creating projects:", err)
		return mapPGError(err)
	}

	return nil
}

// fetch projects;
func (p *ProjectRepository) FetchProjects(ctx context.Context, userId string) ([]models.Project, error) {
	var projects []models.Project

	if err := pgxscan.Select(ctx, p.db, &projects, "SELECT * FROM projects WHERE user_id=$1", &userId); err != nil {
		log.Println("error fetching projects:", err)
		return nil, mapPGError(err)
	}

	return projects, nil
}
