package config

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func ConnectRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	ctx := context.Background()

	_, err := RedisClient.Ping(ctx).Result()
	if err != nil {
		panic(err)
	}

	fmt.Println("Redis connected successfully")
}