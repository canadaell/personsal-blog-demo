package main

import (
	"net/http"

	"github.com/canadaell/personsal-blog-demo/backend/internal/config"
	"github.com/canadaell/personsal-blog-demo/backend/internal/database"
	"github.com/canadaell/personsal-blog-demo/backend/internal/handler"
	"github.com/canadaell/personsal-blog-demo/backend/internal/middleware"
	"github.com/canadaell/personsal-blog-demo/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load Configuration
	config.LoadConfig()

	// 2. Database Connection
	database.Connect()

	// 3. Initialize Router
	r := gin.Default()

	allowedOrigins := make(map[string]struct{}, len(config.AppConfig.CORS.AllowedOrigins))
	for _, origin := range config.AppConfig.CORS.AllowedOrigins {
		if origin != "" {
			allowedOrigins[origin] = struct{}{}
		}
	}

	r.Use(func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" {
			if _, ok := allowedOrigins[origin]; !ok {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Origin not allowed"})
				return
			}
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Vary", "Origin")
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Initialize Services & Handlers
	authService := service.NewAuthService()
	if err := authService.EnsureInitialAdmin(); err != nil {
		panic("failed to bootstrap initial admin: " + err.Error())
	}
	authHandler := handler.NewAuthHandler(authService)

	postService := service.NewPostService()
	postHandler := handler.NewPostHandler(postService)

	uploadService, err := service.NewUploadService()
	uploadEnabled := err == nil && uploadService != nil && uploadService.IsReady()
	if err != nil {
		println("Failed to init upload service:", err.Error())
	}
	uploadHandler := handler.NewUploadHandler(uploadService)

	// Public Routes
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"status":  "ok",
		})
	})
	r.POST("/login", authHandler.Login)
	r.GET("/posts", postHandler.List)
	r.GET("/posts/:id", postHandler.Get)

	// Protected Admin Routes
	adminGroup := r.Group("/admin")
	adminGroup.Use(middleware.AuthMiddleware())
	{
		adminGroup.GET("/check", func(c *gin.Context) {
			userID, _ := c.Get("userID")
			role, _ := c.Get("role")
			c.JSON(200, gin.H{
				"message": "You are authorized",
				"userId":  userID,
				"role":    role,
			})
		})

		adminGroup.POST("/posts", postHandler.Create)
		adminGroup.GET("/posts", postHandler.AdminList)
		adminGroup.GET("/posts/:id", postHandler.AdminGet)
		adminGroup.PUT("/posts/:id", postHandler.Update)
		adminGroup.DELETE("/posts/:id", postHandler.Delete)
		adminGroup.GET("/stats", postHandler.GetStats)
		if uploadEnabled {
			adminGroup.POST("/upload", uploadHandler.Upload)
		} else {
			adminGroup.POST("/upload", func(c *gin.Context) {
				c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Upload service unavailable"})
			})
		}
	}

	// Start Server
	r.Run(config.AppConfig.Server.Port)
}
