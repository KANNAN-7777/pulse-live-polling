package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"

	"live-poll/backend/config"
	"live-poll/backend/models"
)

type CreatePollRequest struct {
	Question string   `json:"question"`
	Options  []string `json:"options"`
}

func CreatePoll(c *gin.Context) {
	var request CreatePollRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request",
		})
		return
	}

	request.Question = strings.TrimSpace(request.Question)

	if request.Question == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Question is required",
		})
		return
	}

	if len(request.Options) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "At least 2 options are required",
		})
		return
	}

	options := make([]models.PollOption, 0, len(request.Options))

	for _, option := range request.Options {
		option = strings.TrimSpace(option)

		if option == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Options cannot be empty",
			})
			return
		}

		options = append(options, models.PollOption{
			ID:    bson.NewObjectID().Hex(),
			Text:  option,
			Votes: 0,
		})
	}

	userID, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "User authentication required",
		})
		return
	}

	poll := models.Poll{
		Question:  request.Question,
		Options:   options,
		CreatedBy: userID.(string),
		CreatedAt: time.Now(),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := config.DB.Collection("polls")

	result, err := collection.InsertOne(ctx, poll)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to create poll",
		})
		return
	}

	poll.ID = result.InsertedID.(bson.ObjectID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Poll created successfully",
		"poll":    poll,
	})
}

func GetPoll(c *gin.Context) {
	pollID := c.Param("id")

	pollObjectID, err := bson.ObjectIDFromHex(pollID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid poll ID",
		})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := config.DB.Collection("polls")

	var poll models.Poll

	err = collection.FindOne(
		ctx,
		bson.M{"_id": pollObjectID},
	).Decode(&poll)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Poll not found",
		})
		return
	}

	voteCollection := config.DB.Collection("votes")

	for i := range poll.Options {
		count, err := voteCollection.CountDocuments(
			ctx,
			bson.M{
				"poll_id":  pollID,
				"option_id": poll.Options[i].ID,
			},
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to count votes",
			})
			return
		}

		poll.Options[i].Votes = int(count)
	}

	c.JSON(http.StatusOK, gin.H{
		"poll": poll,
	})
}