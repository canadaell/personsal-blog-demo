package service

import (
	"context"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"
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

const maxUploadSizeBytes int64 = 10 << 20 // 10MB

var allowedImageMIMEs = map[string]struct{}{
	"image/jpeg": {},
	"image/png":  {},
	"image/webp": {},
	"image/gif":  {},
}

var allowedImageExts = map[string]struct{}{
	".jpg":  {},
	".jpeg": {},
	".png":  {},
	".webp": {},
	".gif":  {},
}

func NewUploadService() (*UploadService, error) {
	if cfg.AppConfig.R2.AccountID == "" || cfg.AppConfig.R2.AccessKeyID == "" || cfg.AppConfig.R2.SecretAccessKey == "" || cfg.AppConfig.R2.BucketName == "" || cfg.AppConfig.R2.PublicDomain == "" {
		return nil, fmt.Errorf("incomplete R2 configuration")
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

func (s *UploadService) IsReady() bool {
	return s != nil && s.s3Client != nil
}

func (s *UploadService) UploadFile(fileHeader *multipart.FileHeader) (string, error) {
	if !s.IsReady() {
		return "", fmt.Errorf("Upload service not initialized properly (check config)")
	}
	if fileHeader.Size <= 0 {
		return "", errors.New("empty file is not allowed")
	}
	if fileHeader.Size > maxUploadSizeBytes {
		return "", errors.New("file is too large (max 10MB)")
	}

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if _, ok := allowedImageExts[ext]; !ok {
		return "", errors.New("unsupported file extension")
	}

	file, err := fileHeader.Open()
	if err != nil {
		return "", err
	}
	defer file.Close()

	sniff := make([]byte, 512)
	n, err := file.Read(sniff)
	if err != nil && !errors.Is(err, io.EOF) {
		return "", fmt.Errorf("failed to inspect file: %w", err)
	}

	contentType := http.DetectContentType(sniff[:n])
	if _, ok := allowedImageMIMEs[contentType]; !ok {
		return "", errors.New("unsupported content type")
	}
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		return "", fmt.Errorf("failed to reset file reader: %w", err)
	}

	// Generate unique filename
	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	// Key structure: uploads/YYYY/MM/filename
	key := fmt.Sprintf("uploads/%s/%s", time.Now().Format("2006/01"), filename)

	_, err = s.s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(cfg.AppConfig.R2.BucketName),
		Key:         aws.String(key),
		Body:        file,
		ContentType: aws.String(contentType),
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
