package service

import (
	"encoding/json"
	"time"

	"github.com/canadaell/personsal-blog-demo/backend/internal/database"
	"github.com/canadaell/personsal-blog-demo/backend/internal/model"
	"gorm.io/datatypes"
)

type PostService struct{}

func NewPostService() *PostService {
	return &PostService{}
}

func (s *PostService) CreatePost(req model.CreatePostRequest) (*model.Post, error) {
	// Serialize content/meta Maps to JSON primitives for GORM
	contentJSON, _ := json.Marshal(req.Content)
	metaJSON, _ := json.Marshal(req.Meta)

	post := model.Post{
		Type:       req.Type,
		SubType:    req.SubType,
		Title:      req.Title,
		Summary:    req.Summary,
		CoverImage: req.CoverImage,
		Content:    datatypes.JSON(contentJSON),
		Meta:       datatypes.JSON(metaJSON),
		Status:     req.Status,
	}

	if post.Status == "" {
		post.Status = "draft"
	}

	if post.Status == "published" {
		now := time.Now()
		post.PublishedAt = &now
	}

	if err := database.DB.Create(&post).Error; err != nil {
		return nil, err
	}

	return &post, nil
}

func (s *PostService) ListPublishedPosts(page, pageSize int) ([]model.Post, int64, error) {
	var posts []model.Post
	var total int64

	// Base query: only published posts
	query := database.DB.Model(&model.Post{}).Where("status = ?", "published")

	// Count total for pagination meta
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Select specific fields for list view (exclude heavy 'content' and 'meta')
	// Order by published_at DESC
	err := query.Order("published_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&posts).Error

	if err != nil {
		return nil, 0, err
	}

	return posts, total, nil
}

func (s *PostService) GetPostByID(id string) (*model.Post, error) {
	var post model.Post
	if err := database.DB.Where("id = ?", id).First(&post).Error; err != nil {
		return nil, err
	}
	return &post, nil
}

func (s *PostService) GetDashboardStats() (*model.DashboardStats, error) {
	var stats model.DashboardStats

	if err := database.DB.Model(&model.Post{}).Count(&stats.Total).Error; err != nil {
		return nil, err
	}
	if err := database.DB.Model(&model.Post{}).Where("status = ?", "published").Count(&stats.Published).Error; err != nil {
		return nil, err
	}
	if err := database.DB.Model(&model.Post{}).Where("status = ?", "draft").Count(&stats.Draft).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

func (s *PostService) ListAllPosts(page, pageSize int) ([]model.Post, int64, error) {
	var posts []model.Post
	var total int64

	query := database.DB.Model(&model.Post{})

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Order("created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&posts).Error

	if err != nil {
		return nil, 0, err
	}

	return posts, total, nil
}
