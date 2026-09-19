package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/DataHubIDE/backend/internal/db"
	"github.com/DataHubIDE/backend/internal/middleware"
	"golang.org/x/crypto/bcrypt"
)

type AuthRequest struct {
	StudentID string `json:"student_id"`
	Password  string `json:"password"`
}

type AuthResponse struct {
	Token     string `json:"token"`
	StudentID string `json:"student_id"`
	Role      string `json:"role"`
	UserID    uint   `json:"user_id"`
}

// Register handler
func Register(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if req.StudentID == "" || req.Password == "" {
		http.Error(w, "Student ID and password are required", http.StatusBadRequest)
		return
	}

	// Check if user already exists
	var existingUser db.User
	if err := db.DB.Where("student_id = ?", req.StudentID).First(&existingUser).Error; err == nil {
		http.Error(w, "Student ID already exists", http.StatusConflict)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	// Create user
	user := db.User{
		StudentID:    req.StudentID,
		PasswordHash: string(hashedPassword),
	}
	
	// First user becomes admin just for convenience (or can be configured otherwise)
	var count int64
	db.DB.Model(&db.User{}).Count(&count)
	if count == 0 {
		user.Role = "admin"
	}

	if err := db.DB.Create(&user).Error; err != nil {
		http.Error(w, "Error saving user", http.StatusInternalServerError)
		return
	}

	// Create empty profile
	profile := db.Profile{
		UserID: user.ID,
		Name:   req.StudentID, // Default to student ID
	}
	db.DB.Create(&profile)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

// Login handler
func Login(w http.ResponseWriter, r *http.Request) {
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	var user db.User
	if err := db.DB.Where("student_id = ?", req.StudentID).First(&user).Error; err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := middleware.GenerateToken(user.ID, user.StudentID, user.Role)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	resp := AuthResponse{
		Token:     token,
		StudentID: user.StudentID,
		Role:      user.Role,
		UserID:    user.ID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
