package middlewares

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/appekt-labs/noti/internals/auth"
	"github.com/appekt-labs/noti/internals/httpx"
)

type Key string

const (
	ClaimsKey Key = "claims"
)

func WithUser(jwtManager *auth.JWTManager) func(http.Handler) http.Handler {

	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			//get the cookie

			c, err := r.Cookie("access_token")

			if err != nil {
				log.Println("No cookie provided:", err)
				httpx.NewError(http.StatusUnauthorized, "Unauthorized").ToHttp(w, http.StatusUnauthorized)
				return
			}

			val := c.Value

			if strings.TrimSpace(val) == "" {
				if authz := r.Header.Get("Authorization"); strings.HasPrefix(authz, "Bearer ") {
					val = strings.TrimSpace(strings.TrimPrefix(authz, "Bearer "))
				}

			}

			if strings.TrimSpace(val) == "" {
				log.Println("Invalid cookie value:", val)
				httpx.NewError(http.StatusUnauthorized, "Unauthorized").ToHttp(w, http.StatusUnauthorized)
				return
			}

			claims, err := jwtManager.VerifyToken(val)

			if err != nil {
				log.Println("Error verifying claims:", err)
				httpx.NewError(http.StatusUnauthorized, "User is Unauthorized").ToHttp(w, http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), ClaimsKey, claims)

			h.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
