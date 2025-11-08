package httpx

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/appekt-labs/noti/internals/derrors"
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

func (e *ErrorResponse) ToHttp(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(e.Code)
	_ = json.NewEncoder(w).Encode(e)
}

func WriteError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, derrors.ErrNotFound):
		NewError(http.StatusNotFound, err.Error()).ToHttp(w, http.StatusNotFound)
	case errors.Is(err, derrors.ErrInternal):
		NewError(http.StatusInternalServerError, err.Error()).ToHttp(w, http.StatusInternalServerError)
	case errors.Is(err, derrors.ErrConflict):
		NewError(http.StatusConflict, err.Error()).ToHttp(w, http.StatusConflict)
	case errors.Is(err, derrors.ErrPermissionDenied):
		NewError(http.StatusUnauthorized, err.Error()).ToHttp(w, http.StatusUnauthorized)
	default:
		NewError(http.StatusInternalServerError, err.Error()).ToHttp(w, http.StatusInternalServerError)
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
