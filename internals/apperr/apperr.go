package apperr

import "errors"

var (
	NotFound     = errors.New("not found")
	UnAuthorized = errors.New("unauthorized")
	Conflict     = errors.New("conflict")
)
