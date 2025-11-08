package models

import (
	"errors"
	"slices"
	"strings"
	"time"

	"github.com/google/uuid"
)

type Message struct {
	Id          string    `json:"id"`
	Title       string    `json:"title"`       //title of the message
	Description string    `json:"description"` //description of the message
	Type        string    `json:"type"`        //banner, modal, toast
	Variant     string    `json:"variant"`     //info, warning, danger, success
	ProjectId   string    `json:"projectId"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	ActiveFrom  time.Time `json:"activeFrom"` //when the notification can be displaced;
	ActiveTo    time.Time `json:"activeTo"`   //when the notification can no longer be displaced
	Metadata    any       `json:"metadata"`   //more information about the message can be dumped here
}

// message creation body;
type CreateMessage struct {
	ProjectId   string
	Description string
	Type        string
	ActiveFrom  time.Time
	ActiveTo    time.Time
	Title       string
	Variant     string
}

// message validation;
func (m CreateMessage) Validate() error {

	// ensure that the project is UUID;
	if err := uuid.Validate(m.ProjectId); err != nil {
		return errors.New("invalid project id")
	}

	// activeFrom is required;
	if m.ActiveTo.IsZero() {
		return errors.New("activeTo is required")
	}

	// activeTo is required;
	if m.ActiveFrom.IsZero() {
		return errors.New("activeFrom is required")
	}

	// validate the time;
	if m.ActiveFrom.After(m.ActiveTo) {
		return errors.New("invalid time range")
	}

	// start with title
	if len(strings.TrimSpace(m.Title)) > 30 {
		return errors.New("title is greater than 30 characters")
	}

	// then description
	if len(strings.TrimSpace(m.Description)) > 100 {
		return errors.New("description is greater than 100 characters")
	}
	// then type;
	validTypes := []string{"banner", "modal", "toast"}

	if !slices.Contains(validTypes, m.Type) {
		return errors.New("type should be banner, modal, or toast")
	}

	// validate the variant;
	validVariants := []string{"info", "warning", "danger", "success"}
	if !slices.Contains(validVariants, m.Variant) {
		return errors.New("variant should be info, warning, danger, or success")
	}
	return nil
}
