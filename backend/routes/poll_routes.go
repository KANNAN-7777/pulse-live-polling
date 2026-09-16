package routes

import (
	"github.com/gin-gonic/gin"

	"live-poll/backend/controllers"
	"live-poll/backend/middleware"

	pollws "live-poll/backend/websocket"
)

func PollRoutes(router *gin.Engine) {
	polls := router.Group("/api/polls")

	polls.POST("/", middleware.AuthMiddleware(), controllers.CreatePoll)
	polls.GET("/my", middleware.AuthMiddleware(), controllers.GetMyPolls)
	polls.POST("/vote", controllers.Vote)
	polls.GET("/:id/ws", pollws.HandlePollWebSocket)
	polls.GET("/:id", controllers.GetPoll)
}