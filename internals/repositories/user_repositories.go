package repositories

import (
	"context"
	"fmt"

	"github.com/appekt-labs/noti/internals/models"
	"github.com/georgysavva/scany/v2/pgxscan"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepo struct {
	db *pgxpool.Pool
}

func NewUserRepo(pgPool *pgxpool.Pool) *UserRepo {
	return &UserRepo{db: pgPool}
}

// save the new user;
func (u *UserRepo) Create(ctx context.Context, user models.CreateUser) (models.UserId, error) {

	var userId models.UserId

	err := pgxscan.Get(ctx, u.db, &userId, "INSERT INTO users (full_name, email, picture) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET full_name=EXCLUDED.full_name, picture=EXCLUDED.picture, updated_at=now() RETURNING id", user.FullName, user.Email, user.Picture)

	if err != nil {
		return "", fmt.Errorf("insert user: %w", err)
	}

	return userId, nil
}

// check if the new users;

func (u *UserRepo) CheckExists(ctx context.Context, email string) (bool, error) {

	var exists bool

	err := pgxscan.Get(ctx, u.db, &exists, "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", email)

	if err != nil {
		return false, fmt.Errorf("check user exists:%w", err)
	}

	return exists, nil
}

// update the old user if exists;
