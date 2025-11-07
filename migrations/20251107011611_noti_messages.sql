-- +goose Up
-- +goose StatementBegin
SELECT
    'up SQL query';

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    variant VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    description TEXT NOT NULL,
    title VARCHAR NOT NULL,
    active_from TIMESTAMPTZ DEFAULT now(),
    active_to TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_At TIMESTAMPTZ DEFAULT now(),
    metadata JSONB
);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
SELECT
    'down SQL query';

-- +goose StatementEnd