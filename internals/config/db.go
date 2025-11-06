package config

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// new db connection pool;
func NewDBPool(ctx context.Context, connString string) (*pgxpool.Pool, error) {

	// configuration for the database connection
	cfg, err := pgxpool.ParseConfig(connString)

	if err != nil {
		return nil, err
	}

	// pool to be used throughout the application
	pool, err := pgxpool.NewWithConfig(ctx, cfg)

	if err != nil {
		return nil, err
	}

	cctx, cancel := context.WithTimeout(context.Background(), time.Second*10)

	defer cancel()
	if err := pool.Ping(cctx); err != nil {
		pool.Close()
		return nil, err
	}

	return pool, nil

}
