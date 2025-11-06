package derrors

import "errors"

// package derrors
var (
	ErrNotFound         = errors.New("not found")
	ErrAlreadyExists    = errors.New("already exists")
	ErrInvalidInput     = errors.New("invalid input")
	ErrConflict         = errors.New("conflict")
	ErrPrecondition     = errors.New("precondition failed")
	ErrUnauthenticated  = errors.New("unauthenticated")
	ErrPermissionDenied = errors.New("permission denied")
	ErrUnavailable      = errors.New("service unavailable")
	ErrTransient        = errors.New("transient, try again")
	ErrInternal         = errors.New("internal error")
)
