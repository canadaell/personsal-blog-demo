package handler

import (
	"net/http"

	"github.com/canadaell/personsal-blog-demo/backend/internal/model"
	"github.com/canadaell/personsal-blog-demo/backend/internal/service"
	"github.com/gin-gonic/gin"
)

type PostHandler struct {
	postService *service.PostService
}

func NewPostHandler(postService *service.PostService) *PostHandler {
	return &PostHandler{
		postService: postService,
	}
}

func (h *PostHandler) Create(c *gin.Context) {
	var req model.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	post, err := h.postService.CreatePost(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, post)
}

func (h *PostHandler) List(c *gin.Context) {
	page := 1
	pageSize := 10

	// Simple query params parsing (could be improved)
	// For now, use defaults

	posts, total, err := h.postService.ListPublishedPosts(page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": posts,
		"meta": gin.H{
			"total":    total,
			"page":     page,
			"pageSize": pageSize,
		},
	})
}

func (h *PostHandler) Get(c *gin.Context) {
	id := c.Param("id")
	post, err := h.postService.GetPostByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}
	c.JSON(http.StatusOK, post)
}
