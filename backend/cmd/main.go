package main

import (
	"github.com/canadaell/personsal-blog-demo/backend/internal/config"
	"github.com/canadaell/personsal-blog-demo/backend/internal/database"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load Configuration
	config.LoadConfig()

	// 2. Database Connection
	database.Connect()

	// 3. Initialize Router
	r := gin.Default()

	// Health Check Endpoint
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"status":  "ok",
		})
	})

	// Start Server
	r.Run(config.AppConfig.Server.Port)
}
