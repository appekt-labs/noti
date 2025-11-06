package services

import (
	"context"

	"github.com/appekt-labs/noti/internals/models"
	"github.com/appekt-labs/noti/internals/repositories"
)

type ProjectService struct {
	r *repositories.ProjectRepository
}

func NewprojectService(r *repositories.ProjectRepository) *ProjectService {

	return &ProjectService{
		r,
	}
}

func (s *ProjectService) Create(ctx context.Context, project models.CreateProject, userId string) error {

	err := s.r.Create(ctx, project.Name, userId)

	if err != nil {
		return err
	}

	return nil
}

func (s *ProjectService) FetchProjects(ctx context.Context, userId string) ([]models.Project, error) {

	projects, err := s.r.FetchProjects(ctx, userId)

	if err != nil {
		return nil, err
	}

	return projects, nil
}
