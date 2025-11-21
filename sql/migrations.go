package migrations

import (
	"database/sql"
	"embed"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func RunMigrations() {
	log.SetFlags(0)
	db, err := sql.Open("pgx", os.Getenv("GOOSE_DBSTRING"))
	if err != nil {
		log.Fatal(err)
	}
	// goose.SetDialect("sqlite3")
	goose.SetBaseFS(embedMigrations) //

	if err := goose.Up(db, "migrations"); err != nil { //
		panic(err)
	}
	if err := goose.Version(db, "migrations"); err != nil {
		log.Fatal(err)
	}
}
