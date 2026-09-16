package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"live-poll/backend/config"
	"live-poll/backend/models"
)

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(c *gin.Context) {
	var request RegisterRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request",
		})
		return
	}

	request.Name = strings.TrimSpace(request.Name)
	request.Email = strings.ToLower(strings.TrimSpace(request.Email))

	if request.Name == "" || request.Email == "" || request.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Name, email and password are required",
		})
		return
	}

	if len(request.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Password must be at least 6 characters",
		})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := config.DB.Collection("users")

	count, err := collection.CountDocuments(ctx, map[string]interface{}{
		"email": request.Email,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Database error",
		})
		return
	}

	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{
			"message": "Email already registered",
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(request.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Password hashing failed",
		})
		return
	}

	user := models.User{
		Name:     request.Name,
		Email:    request.Email,
		Password: string(hashedPassword),
	}

	_, err = collection.InsertOne(ctx, user)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create user",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
	})
}