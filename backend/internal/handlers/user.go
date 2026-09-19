package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/DataHubIDE/backend/internal/db"
	"github.com/DataHubIDE/backend/internal/middleware"
)

// GetProfile retrieves a user's profile and their contribution history
func GetProfile(w http.ResponseWriter, r *http.Request) {
	// Simple path parsing instead of chi/gorilla for zero dependencies
	// e.g., /api/users/1/profile
	// we will just rely on query params or simplified paths
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "User ID required", http.StatusBadRequest)
		return
	}

	userID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	var user db.User
	if err := db.DB.Preload("Profile").Preload("Contributions").First(&user, userID).Error; err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Calculate followers and following count
	var followersCount, followingCount int64
	db.DB.Model(&db.Follow{}).Where("followee_id = ?", userID).Count(&followersCount)
	db.DB.Model(&db.Follow{}).Where("follower_id = ?", userID).Count(&followingCount)

	// Check if current logged-in user is following this user
	isFollowing := false
	if claims, err := middleware.GetUserFromContext(r.Context()); err == nil {
		var follow db.Follow
		if err := db.DB.Where("follower_id = ? AND followee_id = ?", claims.UserID, userID).First(&follow).Error; err == nil {
			isFollowing = true
		}
	}

	response := map[string]interface{}{
		"id":             user.ID,
		"student_id":     user.StudentID,
		"profile":        user.Profile,
		"contributions":  user.Contributions,
		"followers":      followersCount,
		"following":      followingCount,
		"is_following":   isFollowing,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// UpdateProfile updates the logged-in user's profile
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	claims, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		Name        string `json:"name"`
		Bio         string `json:"bio"`
		AvatarURL   string `json:"avatar_url"`
		GithubURL   string `json:"github_url"`
		LinkedinURL string `json:"linkedin_url"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var profile db.Profile
	if err := db.DB.Where("user_id = ?", claims.UserID).First(&profile).Error; err != nil {
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	profile.Name = req.Name
	profile.Bio = req.Bio
	if req.AvatarURL != "" {
		profile.AvatarURL = req.AvatarURL
	}
	profile.GithubURL = req.GithubURL
	profile.LinkedinURL = req.LinkedinURL

	if err := db.DB.Save(&profile).Error; err != nil {
		http.Error(w, "Failed to update profile", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

// SearchUsers searches for users by student ID
func SearchUsers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]interface{}{})
		return
	}

	var users []db.User
	db.DB.Preload("Profile").Where("student_id LIKE ?", "%"+query+"%").Limit(20).Find(&users)

	var results []map[string]interface{}
	for _, u := range users {
		results = append(results, map[string]interface{}{
			"id":         u.ID,
			"student_id": u.StudentID,
			"name":       u.Profile.Name,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// ToggleFollow follows or unfollows a user
func ToggleFollow(w http.ResponseWriter, r *http.Request) {
	claims, err := middleware.GetUserFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		TargetUserID uint `json:"target_user_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if claims.UserID == req.TargetUserID {
		http.Error(w, "Cannot follow yourself", http.StatusBadRequest)
		return
	}

	// Check if target user exists
	var targetUser db.User
	if err := db.DB.First(&targetUser, req.TargetUserID).Error; err != nil {
		http.Error(w, "Target user not found", http.StatusNotFound)
		return
	}

	// Check if already following
	var follow db.Follow
	if err := db.DB.Where("follower_id = ? AND followee_id = ?", claims.UserID, req.TargetUserID).First(&follow).Error; err == nil {
		// Unfollow
		db.DB.Delete(&follow)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"following": false})
		return
	}

	// Follow
	newFollow := db.Follow{
		FollowerID: claims.UserID,
		FolloweeID: req.TargetUserID,
	}
	db.DB.Create(&newFollow)
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"following": true})
}

// GetFollowers returns the list of users following a specific user
func GetFollowers(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "User ID required", http.StatusBadRequest)
		return
	}

	userID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	var follows []db.Follow
	if err := db.DB.Where("followee_id = ?", userID).Find(&follows).Error; err != nil {
		http.Error(w, "Failed to get followers", http.StatusInternalServerError)
		return
	}

	var users []map[string]interface{}
	for _, f := range follows {
		var user db.User
		if err := db.DB.Preload("Profile").First(&user, f.FollowerID).Error; err == nil {
			users = append(users, map[string]interface{}{
				"id":         user.ID,
				"student_id": user.StudentID,
				"name":       user.Profile.Name,
				"avatar_url": user.Profile.AvatarURL,
			})
		}
	}

	if users == nil {
		users = []map[string]interface{}{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// GetFollowing returns the list of users a specific user is following
func GetFollowing(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, "User ID required", http.StatusBadRequest)
		return
	}

	userID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	var follows []db.Follow
	if err := db.DB.Where("follower_id = ?", userID).Find(&follows).Error; err != nil {
		http.Error(w, "Failed to get following", http.StatusInternalServerError)
		return
	}

	var users []map[string]interface{}
	for _, f := range follows {
		var user db.User
		if err := db.DB.Preload("Profile").First(&user, f.FolloweeID).Error; err == nil {
			users = append(users, map[string]interface{}{
				"id":         user.ID,
				"student_id": user.StudentID,
				"name":       user.Profile.Name,
				"avatar_url": user.Profile.AvatarURL,
			})
		}
	}

	if users == nil {
		users = []map[string]interface{}{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// RecordContribution is a helper to record a contribution for today
func RecordContribution(userID uint) {
	today := time.Now().Truncate(24 * time.Hour)
	
	var contribution db.Contribution
	if err := db.DB.Where("user_id = ? AND date = ?", userID, today).First(&contribution).Error; err != nil {
		// Create new contribution record for today
		contribution = db.Contribution{
			UserID: userID,
			Date:   today,
			Count:  1,
		}
		db.DB.Create(&contribution)
	} else {
		// Increment existing
		contribution.Count++
		db.DB.Save(&contribution)
	}
}
