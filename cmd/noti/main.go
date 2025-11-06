package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/appekt-labs/noti/internals/auth"
	"github.com/appekt-labs/noti/internals/config"
	"github.com/appekt-labs/noti/internals/handlers"
	"github.com/appekt-labs/noti/internals/repositories"
	"github.com/appekt-labs/noti/internals/services"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/sessions"
	_ "github.com/joho/godotenv/autoload"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

func main() {
	dbPool, err := config.NewDBPool(context.Background(), os.Getenv("DB_URL"))

	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}

	// jwt manager;
	jwtManager := auth.NewJWTManager(os.Getenv("JWT_SECRET"), time.Minute*15)

	// repositories;
	userRepo := repositories.NewUserRepo(dbPool)

	// services;
	userServices := services.NewUserService(userRepo, jwtManager)

	// handlers;
	userHandler := handlers.NewUserHandler(userServices)
	// goth config;
	// gothic session;
	gothic.Store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET")))

	// gothic providers;
	goth.UseProviders(google.New(
		os.Getenv("GOOGLE_KEY"), os.Getenv("GOOGLE_SECRET"), os.Getenv("GOOGLE_CALLBACK"), "openid", "email", "profile",
	))

	// chi router;
	r := chi.NewMux()

	// auth routes;
	authRoutes := chi.NewMux()
	authRoutes.Get("/{provider}", gothic.BeginAuthHandler)
	authRoutes.Get("/{provider}/callback", userHandler.Login)

	// mount to the main router;
	r.Mount("/auth", authRoutes)
	http.ListenAndServe(":3000", r)
}
