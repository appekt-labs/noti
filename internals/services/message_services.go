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
