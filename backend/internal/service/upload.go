package service

import (
	"context"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	cfg "github.com/canadaell/personsal-blog-demo/backend/internal/config"
	"github.com/google/uuid"
)

type UploadService struct {
	s3Client *s3.Client
}

func NewUploadService() (*UploadService, error) {
	if cfg.AppConfig.R2.AccountID == "" {
		// Log warning but don't crash
		fmt.Println("Warning: R2 config missing, upload service will not work.")
		return &UploadService{}, nil
	}

	r2Resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", cfg.AppConfig.R2.AccountID),
		}, nil
	})

	awsCfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithEndpointResolverWithOptions(r2Resolver),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.AppConfig.R2.AccessKeyID,
			cfg.AppConfig.R2.SecretAccessKey,
			"",
		)),
		config.WithRegion("auto"),
	)
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(awsCfg)

	return &UploadService{s3Client: client}, nil
}

func (s *UploadService) UploadFile(fileHeader *multipart.FileHeader) (string, error) {
	if s.s3Client == nil {
		return "", fmt.Errorf("Upload service not initialized properly (check config)")
	}

	file, err := fileHeader.Open()
	if err != nil {
		return "", err
	}
	defer file.Close()

	// Generate unique filename
	ext := filepath.Ext(fileHeader.Filename)
	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	// Key structure: uploads/YYYY/MM/filename
	key := fmt.Sprintf("uploads/%s/%s", time.Now().Format("2006/01"), filename)

	_, err = s.s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(cfg.AppConfig.R2.BucketName),
		Key:         aws.String(key),
		Body:        file,
		ContentType: aws.String(fileHeader.Header.Get("Content-Type")),
	})
	if err != nil {
		return "", err
	}

	// Construct Public URL
	// Ensure PublicDomain doesn't end with slash
	publicDomain := cfg.AppConfig.R2.PublicDomain
	// If no public domain set, user needs to set it.

	publicURL := fmt.Sprintf("%s/%s", publicDomain, key)

	return publicURL, nil
}
