package handlers

import (
	"context"
	"errors"

	"github.com/appekt-labs/noti/internals/auth"
	"github.com/appekt-labs/noti/internals/middlewares"
)

func GetClaims(ctx context.Context) (auth.UserClaims, error) {
	userClaims, ok := ctx.Value(middlewares.ClaimsKey).(*auth.UserClaims)

	if !ok {
		return auth.UserClaims{}, errors.New("failed to access the user claims")
	}

	return *userClaims, nil
}
