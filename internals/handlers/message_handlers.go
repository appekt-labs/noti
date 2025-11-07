package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/appekt-labs/noti/internals/httpx"
	"github.com/appekt-labs/noti/internals/models"
	"github.com/appekt-labs/noti/internals/services"
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
		httpx.NewError(http.StatusUnauthorized, "unauthorized user").ToHttp(w, http.StatusUnauthorized)
		return
	}

	var message models.CreateMessage

	err = json.NewDecoder(r.Body).Decode(&message)

	if err != nil {
		log.Println("Invalid request:", err)
		httpx.NewError(http.StatusBadRequest, "Invalid request").ToHttp(w, http.StatusBadRequest)
		return
	}

	// validate the message object;
	err = message.Validate()

	if err != nil {
		log.Println("Invalid message body:", err)
		httpx.NewError(http.StatusBadRequest, "Invalid message body").ToHttp(w, http.StatusBadRequest)
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
