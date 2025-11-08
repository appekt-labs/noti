package repositories

import (
	"context"
	"log"
	"time"

	"github.com/appekt-labs/noti/internals/models"
	"github.com/georgysavva/scany/v2/pgxscan"
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

func (r *MessageRepository) FetchAllByProject(ctx context.Context, projectId string, limit int, page int) ([]models.Message, error) {

	var messages []models.Message
	offset := limit * page

	err := pgxscan.Select(ctx, r.db, &messages, "SELECT * FROM messages WHERE project_id=$1 LIMIT $2  OFFSET $3", projectId, limit, offset)

	if err != nil {
		log.Println("error fetching messages:", err)

		return nil, mapPGError(err)
	}

	return messages, nil
}

func (r *MessageRepository) FetchActiveMessagesByProject(ctx context.Context, projectKey string, limit int) ([]models.Message, error) {

	now := time.Now().UTC()

	var messages []models.Message

	err := pgxscan.Select(ctx, r.db, &messages, "select m.* from messages m LEFT JOIN projects p ON m.project_id=p.id WHERE p.project_key=$1 AND m.active_from<=$2 AND m.active_to>=$2 LIMIT $3", projectKey, now, limit)

	if err != nil {
		log.Println("error fetching active projects:", err)
		return nil, mapPGError(err)
	}

	return messages, nil
}
