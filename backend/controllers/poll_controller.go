package controllers

func GetMyPolls(c *gin.Context) {
	userIDValue, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid user",
		})
		return
	}

	cursor, err := config.DB.Collection("polls").Find(
		context.Background(),
		bson.M{
			"created_by": userID,
		},
		options.Find().SetSort(bson.D{
			{Key: "created_at", Value: -1},
		}),
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to fetch polls",
		})
		return
	}

	defer cursor.Close(context.Background())

	var polls []models.Poll

	if err := cursor.All(context.Background(), &polls); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to read polls",
		})
		return
	}

	if polls == nil {
		polls = []models.Poll{}
	}

	c.JSON(http.StatusOK, gin.H{
		"polls": polls,
	})
}

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

func GetMyPolls(c *gin.Context) {
	userIDValue, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	userID, ok := userIDValue.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid user",
		})
		return
	}

	cursor, err := config.DB.Collection("polls").Find(
		context.Background(),
		bson.M{
			"created_by": userID,
		},
		options.Find().SetSort(bson.D{
			{Key: "created_at", Value: -1},
		}),
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to fetch polls",
		})
		return
	}

	defer cursor.Close(context.Background())

	var polls []models.Poll

	if err := cursor.All(context.Background(), &polls); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to read polls",
		})
		return
	}

	if polls == nil {
		polls = []models.Poll{}
	}

	c.JSON(http.StatusOK, gin.H{
		"polls": polls,
	})
}