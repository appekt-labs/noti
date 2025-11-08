package services

import (
	"context"

	"github.com/appekt-labs/noti/internals/models"
	"github.com/appekt-labs/noti/internals/repositories"
)

type MessageService struct {
	r *repositories.MessageRepository
}

func NewMessageService(r *repositories.MessageRepository) *MessageService {

	return &MessageService{
		r,
	}
}

func (s *MessageService) Create(ctx context.Context, message models.CreateMessage) error {

	err := s.r.Create(ctx, message)

	if err != nil {
		return err
	}

	return nil
}

func (s *MessageService) FetchAll(ctx context.Context, projectId string, limit int, page int) ([]models.Message, error) {

	messages, err := s.r.FetchAllByProject(ctx, projectId, limit, page)

	if err != nil {
		return nil, err
	}

	return messages, nil
}

func (s *MessageService) FetchActiveMessages(ctx context.Context, projectKey string, limit int) ([]models.Message, error) {

	messages, err := s.r.FetchActiveMessagesByProject(ctx, projectKey, limit)

	if err != nil {
		return nil, err
	}

	return messages, nil
}
