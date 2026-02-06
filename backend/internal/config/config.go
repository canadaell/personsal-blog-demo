package config

import (
	"log"
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	R2       R2Config       `mapstructure:"r2"`
	Auth     AuthConfig     `mapstructure:"auth"`
	CORS     CORSConfig     `mapstructure:"cors"`
}

type ServerConfig struct {
	Port string `mapstructure:"port"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbname"`
	SSLMode  string `mapstructure:"sslmode"`
}

type R2Config struct {
	AccountID       string `mapstructure:"account_id"`
	AccessKeyID     string `mapstructure:"access_key_id"`
	SecretAccessKey string `mapstructure:"secret_access_key"`
	BucketName      string `mapstructure:"bucket_name"`
	PublicDomain    string `mapstructure:"public_domain"`
}

type AuthConfig struct {
	JWTSecret            string `mapstructure:"jwt_secret"`
	InitialAdminUsername string `mapstructure:"initial_admin_username"`
	InitialAdminEmail    string `mapstructure:"initial_admin_email"`
	InitialAdminPassword string `mapstructure:"initial_admin_password"`
}

type CORSConfig struct {
	AllowedOrigins []string `mapstructure:"allowed_origins"`
}

var AppConfig Config

func LoadConfig() {
	viper.SetConfigFile("config.yaml") // 指定配置文件路径
	viper.AddConfigPath(".")           // 查找配置文件的路径
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv() // 读取环境变量
	viper.SetDefault("cors.allowed_origins", []string{"http://localhost:3000"})

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %s", err)
	}

	if err := viper.Unmarshal(&AppConfig); err != nil {
		log.Fatalf("Unable to decode into struct: %v", err)
	}

	if AppConfig.Auth.JWTSecret == "" {
		log.Fatal("auth.jwt_secret must be set in config or AUTH_JWT_SECRET env")
	}
}
