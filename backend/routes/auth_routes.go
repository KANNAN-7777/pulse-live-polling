package routes

import (
    "github.com/gin-gonic/gin"

    "live-poll/backend/controllers"
    "live-poll/backend/middleware"
)

func AuthRoutes(router *gin.Engine) {
    auth := router.Group("/api/auth")

    auth.POST("/register", controllers.Register)
    auth.POST("/login", controllers.Login)

    auth.GET("/profile", middleware.AuthMiddleware(), controllers.Profile)
}