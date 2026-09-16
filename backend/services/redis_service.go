package services

import (
	"context"
	"encoding/json"
	"fmt"

	"live-poll/backend/config"
)

type LivePollUpdate struct {
	PollID   string `json:"poll_id"`
	OptionID string `json:"option_id"`
	Votes    int64  `json:"votes"`
}

func IncrementVote(pollID string, optionID string) (int64, error) {
	ctx := context.Background()

	key := fmt.Sprintf("poll:%s:votes:%s", pollID, optionID)

	votes, err := config.RedisClient.Incr(ctx, key).Result()
	if err != nil {
		return 0, err
	}

	update := LivePollUpdate{
		PollID:   pollID,
		OptionID: optionID,
		Votes:    votes,
	}

	data, err := json.Marshal(update)
	if err != nil {
		return 0, err
	}

	channel := fmt.Sprintf("poll:%s", pollID)

	err = config.RedisClient.Publish(ctx, channel, data).Err()
	if err != nil {
		return 0, err
	}

	return votes, nil
}
