package controllers

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func Profile(c *gin.Context) {
    userID, _ := c.Get("user_id")
    email, _ := c.Get("email")

    c.JSON(http.StatusOK, gin.H{
        "message": "Protected route accessed successfully",
        "user_id": userID,
        "email":   email,
    })
}