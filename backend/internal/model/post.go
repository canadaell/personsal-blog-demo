package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type Post struct {
	ID         uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Type       string         `gorm:"not null" json:"type"` // 'article', 'plog', 'project'
	SubType    string         `json:"sub_type"`             // Optional secondary category
	Title      string         `gorm:"not null" json:"title"`
	Summary    string         `json:"summary"`
	CoverImage string         `json:"cover_image"`
	Content    datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"content"` // JSONB for Rich Text
	Meta       datatypes.JSON `gorm:"type:jsonb;default:'{}'" json:"meta"`    // JSONB for extra fields
	Status     string         `gorm:"default:'draft'" json:"status"`          // 'draft', 'published'

	PublishedAt *time.Time `json:"published_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

type CreatePostRequest struct {
	Type       string                 `json:"type" binding:"required"`
	SubType    string                 `json:"sub_type"`
	Title      string                 `json:"title" binding:"required"`
	Summary    string                 `json:"summary"`
	CoverImage string                 `json:"cover_image"`
	Content    map[string]interface{} `json:"content"` // Frontend sends raw JSON object, we convert to datatypes.JSON
	Meta       map[string]interface{} `json:"meta"`
	Status     string                 `json:"status"` // 'draft' or 'published'
}

type DashboardStats struct {
	Total     int64 `json:"total"`
	Published int64 `json:"published"`
	Draft     int64 `json:"draft"`
}

type UpdatePostRequest struct {
	Type       string                 `json:"type"`
	SubType    string                 `json:"sub_type"`
	Title      string                 `json:"title"`
	Summary    string                 `json:"summary"`
	CoverImage string                 `json:"cover_image"`
	Content    map[string]interface{} `json:"content"`
	Meta       map[string]interface{} `json:"meta"`
	Status     string                 `json:"status"`
}
