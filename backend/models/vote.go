package models

import "time"

type Vote struct {
    PollID   string    `bson:"poll_id" json:"poll_id"`
    OptionID string    `bson:"option_id" json:"option_id"`
    VotedAt  time.Time `bson:"voted_at" json:"voted_at"`
}