package web

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"path"
	"strings"
	// Note: We avoid external packages like "httpx" or "chi" to keep it self-contained
	// and use standard Go net/http for serving.
)

//go:embed dist/*
var content embed.FS

// LoadWebFS creates a sub-filesystem rooted at the 'dist' directory.
// This is the file system containing the built static assets.
func LoadWebFS() (fs.FS, error) {
	// Create a file system for the embedded 'dist' directory.
	// This makes paths relative to 'dist', e.g., 'index.html' instead of 'dist/index.html'.
	webFS, err := fs.Sub(content, "dist")

	if err != nil {
		log.Printf("Error creating sub-filesystem for 'dist': %v", err)
		return nil, err
	}

	return webFS, nil
}

// LoadWebServer returns an http.Handler that serves the files from the provided fs.FS.
func LoadWebServer(webFS fs.FS) http.Handler {
	// Create the standard FileServer handler.
	return http.FileServer(http.FS(webFS))
}

// Global variable to hold the initialized file server handler.
// This is done once at startup for efficiency.
var fileServer http.Handler
var webFS fs.FS

func init() {
	var err error

	// Initialize the embedded file system.
	webFS, err = LoadWebFS()
	if err != nil {
		log.Fatalf("Failed to initialize web file system: %v", err)
	}

	// Initialize the persistent file server.
	fileServer = LoadWebServer(webFS)
}

// ServeWeb handles requests for static assets, providing an SPA fallback to index.html.
// This function mimics the structure of your example's ServeScripts.
func ServeWeb(w http.ResponseWriter, r *http.Request) {
	// Get the file path requested by the client, relative to the root.
	upath := strings.TrimPrefix(r.URL.Path, "/")

	// 1. Check if the requested path corresponds to an existing file in 'dist'.
	// We use the already initialized webFS (which is rooted at 'dist').
	if f, err := webFS.Open(upath); err == nil {
		// File exists.
		f.Close() // Close the opened file handle.

		// Set a general header for static assets (optional, but good practice).
		// Note: The http.FileServer will automatically set Content-Type.
		w.Header().Set("Cache-Control", "public, max-age=3600")

		// Serve the file using the pre-initialized file server.
		fileServer.ServeHTTP(w, r)
		return
	}

	// 2. File does NOT exist (or is a directory), so we assume it's a client-side route.
	// Serve the main 'index.html' file to let the React router handle the path.

	// The path package resolves to "dist/index.html" based on the package's root.
	// The http.ServeFile will use the OS file system if the file is not embedded,
	// but here we know the file is embedded via the 'dist' directory.
	// However, for pure embedded content, using a custom handler or the fileServer is better.

	// OPTIMAL SPA FALLBACK: Manually serve the embedded index.html content.
	// This avoids path issues with ServeFile and ensures we use the embed.FS content.

	// Set the Content-Type explicitly for HTML.
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache") // No-cache for the SPA main file.

	// Read and serve the index.html file content from the embedded FS.
	indexContent, err := fs.ReadFile(content, path.Join("dist", "index.html"))
	if err != nil {
		// This should only happen if 'dist/index.html' is missing from the build.
		http.Error(w, "SPA index file not found", http.StatusNotFound)
		log.Printf("Failed to read index.html from embedded FS: %v", err)
		return
	}

	w.Write(indexContent)
}
