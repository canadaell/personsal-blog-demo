package database

import (
	"fmt"
	"log"

	"github.com/canadaell/personsal-blog-demo/backend/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	cfg := config.AppConfig.Database
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		// 注意：在实际生产中，可能希望在这里 panic 或者重试，
		// 但为了演示时如果没有数据库也能启动 server (方便调试接口)，我们这里仅仅打印错误
		// 如果你希望严格启动，可以将 log.Printf 改为 log.Fatal
		// log.Fatal("Failed to connect to database")
	} else {
		log.Println("Database connection established successfully")
	}
}
