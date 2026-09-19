package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/DataHubIDE/backend/internal/db"
	"github.com/DataHubIDE/backend/internal/middleware"
)

// ListUsers lists all users (admin only)
func ListUsers(w http.ResponseWriter, r *http.Request) {
	claims, err := middleware.GetUserFromContext(r.Context())
	if err != nil || claims.Role != "admin" {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	var users []db.User
	db.DB.Preload("Profile").Find(&users)

	var results []map[string]interface{}
	for _, u := range users {
		
		// calculate total contributions
		var contributions []db.Contribution
		db.DB.Where("user_id = ?", u.ID).Find(&contributions)
		totalContributions := 0
		for _, c := range contributions {
			totalContributions += c.Count
		}

		results = append(results, map[string]interface{}{
			"id":                  u.ID,
			"student_id":          u.StudentID,
			"role":                u.Role,
			"name":                u.Profile.Name,
			"total_contributions": totalContributions,
			"created_at":          u.CreatedAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// DeleteUser deletes a user (admin only)
func DeleteUser(w http.ResponseWriter, r *http.Request) {
	claims, err := middleware.GetUserFromContext(r.Context())
	if err != nil || claims.Role != "admin" {
		http.Error(w, "Forbidden", http.StatusForbidden)
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
		http.Error(w, "Cannot delete yourself", http.StatusBadRequest)
		return
	}

	// Delete user and associated data
	tx := db.DB.Begin()
	tx.Where("user_id = ?", req.TargetUserID).Delete(&db.Profile{})
	tx.Where("user_id = ?", req.TargetUserID).Delete(&db.Contribution{})
	tx.Where("follower_id = ? OR followee_id = ?", req.TargetUserID, req.TargetUserID).Delete(&db.Follow{})
	tx.Delete(&db.User{}, req.TargetUserID)
	tx.Commit()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "User deleted"})
}
