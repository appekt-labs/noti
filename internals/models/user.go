package models

import "time"

type UserId string

type CreateUser struct {
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Picture  string `json:"picture"`
}

type User struct {
	Id        string    `json:"id"`
	FullName  string    `json:"fullName"`
	Email     string    `json:"email"`
	Picture   string    `json:"picture"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
