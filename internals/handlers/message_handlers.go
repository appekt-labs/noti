package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/appekt-labs/noti/internals/httpx"
	"github.com/appekt-labs/noti/internals/models"
	"github.com/appekt-labs/noti/internals/services"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type MessageHandler struct {
	s *services.MessageService
}

func NewMessageHandler(s *services.MessageService) *MessageHandler {

	return &MessageHandler{
		s,
	}
}

func (h *MessageHandler) Create(w http.ResponseWriter, r *http.Request) {
	_, err := GetClaims(r.Context())

	if err != nil {
		httpx.NewError(http.StatusUnauthorized, "unauthorized user").ToHttp(w)
		return
	}

	var message models.CreateMessage

	err = json.NewDecoder(r.Body).Decode(&message)

	if err != nil {
		log.Println("Invalid request:", err)
		httpx.NewError(http.StatusBadRequest, "Invalid request").ToHttp(w)
		return
	}

	// validate the message object;
	err = message.Validate()

	if err != nil {
		log.Println("Invalid message body:", err)
		httpx.NewError(http.StatusBadRequest, "Invalid message body").ToHttp(w)
		return
	}

	err = h.s.Create(r.Context(), message)

	if err != nil {
		httpx.WriteError(w, err)
		return
	}

	httpx.JSON(w, http.StatusCreated, httpx.SuccessResponse{
		Code:    http.StatusCreated,
		Message: "Message successfully created",
	})
}

func (h *MessageHandler) FetchAllMessages(w http.ResponseWriter, r *http.Request) {
	projectId := chi.URLParam(r, "projectId")
	limit := r.URL.Query().Get("limit")
	page := r.URL.Query().Get("page")

	if strings.TrimSpace(projectId) == "" {
		log.Println("Invalid project ID(empty):", projectId)
		httpx.NewError(http.StatusBadRequest, "Invalid project id").ToHttp(w)
		return
	}

	if err := uuid.Validate(strings.TrimSpace(projectId)); err != nil {
		log.Println("project Id should be a uuid but got:", projectId, "err:", err)
		httpx.NewError(http.StatusBadRequest, "Invalid project id").ToHttp(w)
		return
	}

	if strings.TrimSpace(page) == "" {
		page = "0"
	}

	if strings.TrimSpace(limit) == "" {
		limit = "20"
	}

	limitInt, err := strconv.Atoi(limit)

	if err != nil {
		log.Println("Invalid limit:", err)
		httpx.NewError(http.StatusBadRequest, "Invalid limit").ToHttp(w)
		return
	}

	pageInt, err := strconv.Atoi(page)

	if err != nil {
		log.Println("Invalid page:", err)
		httpx.NewError(http.StatusBadRequest, "Invalid page").ToHttp(w)
		return
	}

	messages, err := h.s.FetchAll(r.Context(), projectId, limitInt, pageInt)
	if err != nil {
		httpx.WriteError(w, err)
		return
	}
	httpx.JSON(w, http.StatusOK, messages)
}

func (h *MessageHandler) FetchActiveMessages(w http.ResponseWriter, r *http.Request) {

	// hard limit;
	limit := 20

	projectKey := chi.URLParam(r, "projectKey")
	if strings.TrimSpace(projectKey) == "" {
		log.Println("Invalid project ID(empty):", projectKey)
		httpx.NewError(http.StatusBadRequest, "Invalid project id").ToHttp(w)
		return
	}

	messages, err := h.s.FetchActiveMessages(r.Context(), projectKey, limit)
	if err != nil {
		httpx.WriteError(w, err)
		return
	}

	httpx.JSON(w, http.StatusOK, messages)
}
