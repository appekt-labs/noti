package handlers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/appekt-labs/noti/internals/httpx"
	"github.com/appekt-labs/noti/internals/models"
	"github.com/appekt-labs/noti/internals/services"
	"github.com/markbates/goth/gothic"
)

type UserHandler struct {
	userSvc *services.UserService
}

func NewUserHandler(svc *services.UserService) *UserHandler {

	return &UserHandler{
		svc,
	}
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	// use gothic to get the user information;
	user, err := gothic.CompleteUserAuth(w, r)

	if err != nil {
		log.Println("Gothic error:", err)
		httpx.NewError(http.StatusBadGateway, "Failed to complete auth").ToHttp(w)

		return
	}

	// then call the user service to either update or create the user in out DB;
	token, err := h.userSvc.CreateUser(context.Background(), models.CreateUser{
		FullName: user.Name,
		Email:    user.Email,
		Picture:  user.AvatarURL,
	})

	if err != nil {
		log.Println("error creating token:", err)
		httpx.WriteError(w, err)
		return
	}

	// set the cookies;
	httpx.SetCookie(w, token, httpx.AuthCookiecfg{
		Name:     "access_token",
		Path:     "/",
		HttpOnly: false,
		Secure:   false,
		MaxAge:   time.Second * 15,
	})
	// redirect to dashboard
	http.Redirect(w, r, "http://localhost:5173/dashboard", http.StatusSeeOther)
}
