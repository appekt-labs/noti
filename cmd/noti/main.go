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
	"github.com/appekt-labs/noti/internals/middlewares"
	"github.com/appekt-labs/noti/internals/repositories"
	"github.com/appekt-labs/noti/internals/services"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
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
	jwtManager := auth.NewJWTManager(os.Getenv("JWT_SECRET"), time.Minute*100)

	// repositories;
	userRepo := repositories.NewUserRepo(dbPool)
	projectRepo := repositories.NewProjectRepository(dbPool)
	messageRepo := repositories.NewMessageRepository(dbPool)
	// services;
	userServices := services.NewUserService(userRepo, jwtManager)
	projectServices := services.NewprojectService(projectRepo)
	messageService := services.NewMessageService(messageRepo)
	// handlers;
	userHandler := handlers.NewUserHandler(userServices)
	projectHandlers := handlers.NewProjectHandler(projectServices)
	messageHandler := handlers.NewMessageHandler(messageService)
	// goth config;
	// gothic session;
	gothic.Store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET")))

	// gothic providers;
	goth.UseProviders(google.New(
		os.Getenv("GOOGLE_KEY"), os.Getenv("GOOGLE_SECRET"), os.Getenv("GOOGLE_CALLBACK"), "openid", "email", "profile",
	))

	// chi router;
	r := chi.NewMux()

	// logger;
	r.Use(middleware.Logger)
	// r.Use(middleware.Recoverer)

	// cors and allowed methods;
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// auth routes;
	authRoutes := chi.NewMux()
	authRoutes.Get("/{provider}", gothic.BeginAuthHandler)
	authRoutes.Get("/{provider}/callback", userHandler.Login)

	// protected routes;
	r.Group(func(p chi.Router) {
		// middleware goes here;
		p.Use(middlewares.WithUser(jwtManager))
		p.Post("/projects", projectHandlers.Create)
		p.Get("/projects", projectHandlers.FetchProjects)
		p.Get("/projects/{projectId}/messages", messageHandler.FetchAllMessages)
		p.Post("/messages", messageHandler.Create)
	})

	// public route for fetching messages(to be used by the public script);
	r.Get("/projects/{projectKey}/messages", messageHandler.FetchActiveMessages)

	// mount to the main router;
	r.Mount("/auth", authRoutes)
	http.ListenAndServe(":3000", r)
}
