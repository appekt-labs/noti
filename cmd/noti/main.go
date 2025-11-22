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
	"github.com/appekt-labs/noti/internals/httpx"
	"github.com/appekt-labs/noti/internals/middlewares"
	"github.com/appekt-labs/noti/internals/repositories"
	"github.com/appekt-labs/noti/internals/services"
	"github.com/appekt-labs/noti/scripts"
	migrations "github.com/appekt-labs/noti/sql"
	"github.com/appekt-labs/noti/web"
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

	// run migrations;
	migrations.RunMigrations()

	// ctx, defer := context.WithTimeout(context.Background(), time.Second*5);
	dbCtx, close := context.WithTimeout(context.Background(), time.Second*5)

	defer close()

	dbPool, err := config.NewDBPool(dbCtx, os.Getenv("DB_URL"))

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
		AllowedOrigins:   []string{os.Getenv("ALLOWED_ORIGIN")},
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
	authRoutes.Get("/logout", func(w http.ResponseWriter, r *http.Request) {
		err := gothic.Logout(w, r)

		if err != nil {
			log.Println("error logging out: ", w)
			httpx.NewError(http.StatusBadRequest, "Failed to log out").ToHttp(w)
			return
		}
		http.Redirect(w, r, os.Getenv("APP_URL"), http.StatusSeeOther)
	})

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
	r.Get("/projects/{projectKey}/notifications", messageHandler.FetchActiveMessages)

	// mount to the main router;
	r.Mount("/auth", authRoutes)

	// v1 api router;
	apiV1 := chi.NewMux()

	apiV1.Mount("/api/v1", r)

	// serve the static scripts for the client;
	// seperate route to serve the script;
	scriptRoute := chi.NewMux()
	scriptRoute.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
	scriptRoute.Get("/*", scripts.ServeScripts)
	apiV1.Mount("/scripts", scriptRoute)

	// mounted client;
	webRouter := chi.NewMux()
	webRouter.Get("/*", web.ServeWeb)
	apiV1.Mount("/", webRouter)

	http.ListenAndServe(":3000", apiV1)
}
