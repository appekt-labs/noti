package scripts

import (
	"embed"
	"io/fs"
	"log"
	"mime"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/appekt-labs/noti/internals/httpx"
)

//go:embed scripts/*
var scripts embed.FS

func LoadScriptFS() (fs.FS, error) {

	// create a file system for the scripts;
	scriptFS, err := fs.Sub(scripts, ".")

	if err != nil {

		return nil, err
	}

	return scriptFS, nil
}

func LoadScriptServer(scriptFS fs.FS) http.Handler {
	// create a file server;
	scriptServer := http.FileServer(http.FS(scriptFS))

	return scriptServer
}

func ServeScripts(w http.ResponseWriter, r *http.Request) {

	// get the file path;
	upath := r.URL.Path

	// scriptFS;
	scriptFS, err := LoadScriptFS()

	if err != nil {
		log.Println("Failed to create a file system for the scripts:", err)
		httpx.NewError(http.StatusInternalServerError, "Failed to load scripts").ToHttp(w)
		return
	}

	// file server;

	scriptServer := LoadScriptServer(scriptFS)

	// return the files details;
	if f, err := scriptFS.Open(strings.TrimPrefix(upath, "/")); err == nil {

		// close file after;
		err := f.Close()

		if err != nil {
			log.Println("Failed to close file:", err)
		}

		// write headers;
		w.Header().Set("Cache-Control", "no cache")

		// set content type based on the returned file;
		if ext := mime.TypeByExtension(filepath.Ext(upath)); ext != "" {
			w.Header().Set("Content-Type", ext)
		}

		scriptServer.ServeHTTP(w, r)
		return

	}
	httpx.NewError(http.StatusNotFound, "requested file doesn't exist on our server").ToHttp(w)
	log.Println("Error opening file:", err)
}
