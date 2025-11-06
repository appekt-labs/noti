package models

import (
	"errors"
	"strings"
	"time"
)

type CreateProject struct {
	Name string `json:"name"`
}

type Project struct {
	Id         string
	Name       string
	ProjectKey string
	CreatedAt  time.Time
	UpdatedAt  time.Time
	UserId     string
}

func (p CreateProject) Validate() error {

	if strings.TrimSpace(p.Name) == "" {

		return errors.New("name should be atleast 2 characters")
	}

	if len(strings.TrimSpace(p.Name)) > 100 {
		return errors.New("name should be more than 100 characters")
	}

	return nil
}
