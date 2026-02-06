package main

import (
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

	// CORS Middleware (Temporary for dev, refine for prod)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

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
	if err != nil {
		// Just log error, don't crash, maybe R2 not configured
		// But in main.go often panic is okay. User asked for flexibility.
		// Let's print.
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
		adminGroup.PUT("/posts/:id", postHandler.Update)
		adminGroup.DELETE("/posts/:id", postHandler.Delete)
		adminGroup.GET("/stats", postHandler.GetStats)
		adminGroup.POST("/upload", uploadHandler.Upload)
	}

	// Start Server
	r.Run(config.AppConfig.Server.Port)
}
