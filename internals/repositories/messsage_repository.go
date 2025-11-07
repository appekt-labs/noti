package repositories

import (
	"context"
	"log"

	"github.com/appekt-labs/noti/internals/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

type MessageRepository struct {
	db *pgxpool.Pool
}

func NewMessageRepository(db *pgxpool.Pool) *MessageRepository {
	return &MessageRepository{
		db,
	}
}

func (r *MessageRepository) Create(ctx context.Context, message models.CreateMessage) error {

	_, err := r.db.Exec(ctx, "INSERT INTO messages (title, description, type, variant, active_from, active_to, project_id) VALUES($1, $2, $3, $4, $5, $6, $7)", message.Title, message.Description, message.Type, message.Variant, message.ActiveFrom, message.ActiveTo, message.ProjectId)

	if err != nil {
		log.Println("Error creating message:", err)
		return mapPGError(err)
	}

	return nil
}
