package service

import (
	"errors"
	"time"

	"github.com/canadaell/personsal-blog-demo/backend/internal/database"
	"github.com/canadaell/personsal-blog-demo/backend/internal/model"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var jwtSecret = []byte("your-secret-key-should-be-in-env") // TODO: Move to config

type AuthService struct{}

func NewAuthService() *AuthService {
	// Simple loader for secret from config if available, fallback for now
	// In production, load this from config.AppConfig or env
	return &AuthService{}
}

func (s *AuthService) Login(req model.LoginRequest) (*model.LoginResponse, error) {
	var user model.AdminUser

	// 1. Find user
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid credentials")
		}
		return nil, err
	}

	// 2. Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	// 3. Generate JWT
	token, err := s.generateToken(&user)
	if err != nil {
		return nil, err
	}

	return &model.LoginResponse{
		Token: token,
		User: struct {
			ID       uuid.UUID `json:"id"`
			Username string    `json:"username"`
			Role     string    `json:"role"`
		}{
			ID:       user.ID,
			Username: user.Username,
			Role:     user.Role,
		},
	}, nil
}

func (s *AuthService) generateToken(user *model.AdminUser) (string, error) {
	claims := jwt.MapClaims{
		"sub":  user.ID.String(),
		"name": user.Username,
		"role": user.Role,
		"exp":  time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
