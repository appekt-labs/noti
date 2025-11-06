package httpx

import (
	"net/http"
	"time"
)

type AuthCookiecfg struct {
	Name     string
	Domain   string
	Path     string
	MaxAge   time.Duration
	SameSite http.SameSite
	Secure   bool
	HttpOnly bool
}

func SetCookie(w http.ResponseWriter, token string, cfg AuthCookiecfg) {

	http.SetCookie(w, &http.Cookie{
		Name:     cfg.Name,
		HttpOnly: cfg.HttpOnly,
		Path:     "/",
		MaxAge:   int(cfg.MaxAge),
		Secure:   cfg.Secure,
		Value:    token,
	})
}
