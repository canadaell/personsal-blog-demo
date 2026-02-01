package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
}

type ServerConfig struct {
	Port string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

var AppConfig Config

func LoadConfig() {
	viper.SetConfigFile("config.yaml") // 指定配置文件路径
	viper.AddConfigPath(".")           // 查找配置文件的路径
	viper.AutomaticEnv()               // 读取环境变量

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %s", err)
	}

	if err := viper.Unmarshal(&AppConfig); err != nil {
		log.Fatalf("Unable to decode into struct: %v", err)
	}
}
