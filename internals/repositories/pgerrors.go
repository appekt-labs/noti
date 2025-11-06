package repositories

import (
	"context"
	"errors"
	"fmt"

	"github.com/appekt-labs/noti/internals/derrors"
	"github.com/jackc/pgx"
	"github.com/jackc/pgx/v5/pgconn"
)

func mapPGError(err error) error {
	if err == nil {
		return nil
	}

	// No rows
	if errors.Is(err, pgx.ErrNoRows) {
		return derrors.ErrNotFound
	}

	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		switch pgErr.Code {
		case "23505": // unique_violation
			return fmt.Errorf("%w", derrors.ErrAlreadyExists)
		case "23503": // foreign_key_violation
			return fmt.Errorf("%w", derrors.ErrPrecondition)
		case "23514": // check_violation
			return fmt.Errorf("%w", derrors.ErrInvalidInput)
		case "40001": // serialization_failure (retryable)
			return fmt.Errorf("%w", derrors.ErrTransient)
		case "40P01": // deadlock_detected (retryable)
			return fmt.Errorf("%w", derrors.ErrTransient)
		case "23502": // not_null_violation
			return fmt.Errorf("%w", derrors.ErrInvalidInput)
		case "42501": // insufficient_privilege
			return fmt.Errorf("%w", derrors.ErrPermissionDenied)
		default:
			// Log pgErr for observability, but don't leak it upward.
			return fmt.Errorf("%w", derrors.ErrInternal)
		}
	}

	// Connection/pool issues often surface as context or net errors – treat as unavailable
	// (Your pool timeouts/cancelled contexts should map here.)
	if errors.Is(err, context.DeadlineExceeded) || errors.Is(err, context.Canceled) {
		return fmt.Errorf("%w", derrors.ErrUnavailable)
	}

	return fmt.Errorf("%w", derrors.ErrInternal)
}
