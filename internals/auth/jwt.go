package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type UserClaims struct {
	UserId string `json:"userId"`
	jwt.RegisteredClaims
}

type JWTManager struct {
	secret        string
	tokenDuration time.Duration
}

func NewJWTManager(secret string, tokenDuration time.Duration) *JWTManager {

	return &JWTManager{
		secret,
		tokenDuration,
	}
}

func (j *JWTManager) GenerateToken(userId string) (string, error) {
	claims := &UserClaims{
		UserId: userId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(j.tokenDuration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(j.secret))
}

func (j *JWTManager) VerifyToken(tokenStr string) (*UserClaims, error) {
	claims := UserClaims{}
	token, err := jwt.ParseWithClaims(tokenStr, &claims, func(t *jwt.Token) (any, error) {

		if t.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(j.secret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	if time.Now().UTC().After(claims.ExpiresAt.Time) {

		return nil, errors.New("token is expired")
	}

	return &claims, nil
}
