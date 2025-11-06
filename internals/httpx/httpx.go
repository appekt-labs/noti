package httpx

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/appekt-labs/noti/internals/apperr"
)

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func NewError(code int, message string) *ErrorResponse {
	return &ErrorResponse{
		code, message,
	}
}

func (e *ErrorResponse) ToHttp(w http.ResponseWriter, s int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(s)
	_ = json.NewEncoder(w).Encode(e)
}

func WriteError(w http.ResponseWriter, err error) {

	switch {
	case errors.Is(err, apperr.NotFound):
		NewError(http.StatusNotFound, err.Error()).ToHttp(w, http.StatusNotFound)
	}
}

func JSON(w http.ResponseWriter, s int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(s)
	_ = json.NewEncoder(w).Encode(v)
}

type SuccessResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
