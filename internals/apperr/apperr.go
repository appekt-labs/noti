package apperr

import "errors"

var (
	ErrNotFound     = errors.New("not found")
	ErrUnAuthorized = errors.New("unauthorized")
	ErrConflict     = errors.New("conflict")
	ErrServerFailed = errors.New("server error")
)
