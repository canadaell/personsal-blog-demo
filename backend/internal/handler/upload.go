package handler

import (
	"net/http"

	"github.com/canadaell/personsal-blog-demo/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type UploadHandler struct {
	uploadService *service.UploadService
}

func NewUploadHandler(uploadService *service.UploadService) *UploadHandler {
	return &UploadHandler{
		uploadService: uploadService,
	}
}

func (h *UploadHandler) Upload(c *gin.Context) {
	if h.uploadService == nil || !h.uploadService.IsReady() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Upload service unavailable"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded (key must be 'file')"})
		return
	}

	url, err := h.uploadService.UploadFile(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}
