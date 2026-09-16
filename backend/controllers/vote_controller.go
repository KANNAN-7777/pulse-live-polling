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
	"live-poll/backend/services"
)

type VoteRequest struct {
	PollID   string `json:"poll_id"`
	OptionID string `json:"option_id"`
}

func Vote(c *gin.Context) {
	var request VoteRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request",
		})
		return
	}

	request.PollID = strings.TrimSpace(request.PollID)
	request.OptionID = strings.TrimSpace(request.OptionID)

	if request.PollID == "" || request.OptionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Poll ID and option ID are required",
		})
		return
	}

	pollObjectID, err := bson.ObjectIDFromHex(request.PollID)

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

	err = collection.FindOne(ctx, bson.M{
		"_id": pollObjectID,
	}).Decode(&poll)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Poll not found",
		})
		return
	}

	optionExists := false

	for _, option := range poll.Options {
		if option.ID == request.OptionID {
			optionExists = true
			break
		}
	}

	if !optionExists {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid option",
		})
		return
	}

	vote := models.Vote{
		PollID:   request.PollID,
		OptionID: request.OptionID,
		VotedAt:  time.Now(),
	}

	_, err = config.DB.Collection("votes").InsertOne(ctx, vote)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to record vote",
		})
		return
	}

	votes, err := services.IncrementVote(
		request.PollID,
		request.OptionID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Vote saved but live update failed",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Vote recorded successfully",
		"votes":   votes,
	})
}
