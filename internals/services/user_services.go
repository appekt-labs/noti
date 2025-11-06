package services

import (
	"context"

	"github.com/appekt-labs/noti/internals/auth"
	"github.com/appekt-labs/noti/internals/models"
	"github.com/appekt-labs/noti/internals/repositories"
)

type UserService struct {
	userRepo *repositories.UserRepo
	jwt      *auth.JWTManager
}

func NewUserService(userRepo *repositories.UserRepo, jwt *auth.JWTManager) *UserService {

	return &UserService{
		userRepo,
		jwt,
	}
}

// create user;
func (s *UserService) CreateUser(ctx context.Context, user models.CreateUser) (string, error) {

	userId, err := s.userRepo.Create(ctx, user)

	if err != nil {
		return "", err
	}

	token, err := s.jwt.GenerateToken(string(userId))

	if err != nil {
		return "", err
	}

	return token, nil
}
