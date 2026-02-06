package handler

import (
	"net/http"
	"strconv"

	"github.com/canadaell/personsal-blog-demo/backend/internal/model"
	"github.com/canadaell/personsal-blog-demo/backend/internal/service"
	"github.com/gin-gonic/gin"
)

const (
	defaultPublicPageSize = 10
	defaultAdminPageSize  = 20
	maxPublicPageSize     = 50
	maxAdminPageSize      = 100
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
	page, pageSize, err := parsePaginationParams(c, 1, defaultPublicPageSize, maxPublicPageSize)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	typeFilter := c.Query("type")
	subTypeFilter := c.Query("sub_type")

	posts, total, err := h.postService.ListPublishedPosts(page, pageSize, typeFilter, subTypeFilter)
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
	post, err := h.postService.GetPublishedPostByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}
	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) AdminGet(c *gin.Context) {
	id := c.Param("id")
	post, err := h.postService.GetPostByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}
	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) GetStats(c *gin.Context) {
	stats, err := h.postService.GetDashboardStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stats"})
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *PostHandler) AdminList(c *gin.Context) {
	page, pageSize, err := parsePaginationParams(c, 1, defaultAdminPageSize, maxAdminPageSize)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	posts, total, err := h.postService.ListAllPosts(page, pageSize)
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

func (h *PostHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req model.UpdatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	post, err := h.postService.UpdatePost(id, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
		return
	}

	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.postService.DeletePost(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete post"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}

func parsePaginationParams(c *gin.Context, defaultPage, defaultPageSize, maxPageSize int) (int, int, error) {
	page := defaultPage
	pageSize := defaultPageSize

	if pageRaw := c.Query("page"); pageRaw != "" {
		parsed, err := strconv.Atoi(pageRaw)
		if err != nil || parsed < 1 {
			return 0, 0, errPaginationInvalid("page")
		}
		page = parsed
	}

	if pageSizeRaw := c.Query("pageSize"); pageSizeRaw != "" {
		parsed, err := strconv.Atoi(pageSizeRaw)
		if err != nil || parsed < 1 {
			return 0, 0, errPaginationInvalid("pageSize")
		}
		if parsed > maxPageSize {
			return 0, 0, errPaginationTooLarge(maxPageSize)
		}
		pageSize = parsed
	}

	return page, pageSize, nil
}

func errPaginationInvalid(field string) error {
	return &paginationError{message: field + " must be a positive integer"}
}

func errPaginationTooLarge(maxPageSize int) error {
	return &paginationError{message: "pageSize must be <= " + strconv.Itoa(maxPageSize)}
}

type paginationError struct {
	message string
}

func (e *paginationError) Error() string {
	return e.message
}
