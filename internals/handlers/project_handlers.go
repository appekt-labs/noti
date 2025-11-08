package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/appekt-labs/noti/internals/auth"
	"github.com/appekt-labs/noti/internals/httpx"
	"github.com/appekt-labs/noti/internals/middlewares"
	"github.com/appekt-labs/noti/internals/models"
	"github.com/appekt-labs/noti/internals/services"
)

type ProjectHandler struct {
	s *services.ProjectService
}

func NewProjectHandler(s *services.ProjectService) *ProjectHandler {
	return &ProjectHandler{
		s,
	}
}

func (h *ProjectHandler) Create(w http.ResponseWriter, r *http.Request) {

	// user Id;
	userClaims, ok := r.Context().Value(middlewares.ClaimsKey).(*auth.UserClaims)

	if !ok {
		httpx.NewError(http.StatusUnauthorized, "Unauthorized").ToHttp(w)
		return
	}

	//body which is of models.CreateProject;
	var project models.CreateProject

	err := json.NewDecoder(r.Body).Decode(&project)

	if err != nil {
		httpx.NewError(http.StatusBadRequest, "no name provided").ToHttp(w)
		return
	}

	// validate project(Name is required)
	err = project.Validate()

	if err != nil {
		httpx.NewError(http.StatusBadRequest, err.Error()).ToHttp(w)
		return
	}

	err = h.s.Create(r.Context(), project, userClaims.UserId)

	if err != nil {
		httpx.WriteError(w, err)
		return
	}

	httpx.JSON(w, http.StatusCreated, httpx.SuccessResponse{
		Code:    http.StatusCreated,
		Message: "Project successfully created",
	})
}

func (h *ProjectHandler) FetchProjects(w http.ResponseWriter, r *http.Request) {
	// user Id;
	userClaims, ok := r.Context().Value(middlewares.ClaimsKey).(*auth.UserClaims)

	if !ok {
		log.Println("failed to decode the user claims in context")
		httpx.NewError(http.StatusUnauthorized, "Unauthorized").ToHttp(w)
		return
	}

	projects, err := h.s.FetchProjects(r.Context(), userClaims.UserId)

	if err != nil {
		httpx.WriteError(w, err)
		return
	}

	httpx.JSON(w, http.StatusOK, projects)
}
