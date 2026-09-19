package db

import (
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

// User model represents a student
type User struct {
	ID           uint      `gorm:"primaryKey"`
	StudentID    string    `gorm:"uniqueIndex;not null"`
	PasswordHash string    `gorm:"not null"`
	Role         string    `gorm:"default:'student'"` // 'student' or 'admin'
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Profile      Profile        `gorm:"foreignKey:UserID"`
	Contributions []Contribution `gorm:"foreignKey:UserID"`
}

// Profile model stores user profile information
type Profile struct {
	ID          uint   `gorm:"primaryKey"`
	UserID      uint   `gorm:"uniqueIndex;not null"`
	Name        string
	Bio         string
	AvatarURL   string
	GithubURL   string
	LinkedinURL string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// Contribution model tracks daily code runs
type Contribution struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	Date      time.Time `gorm:"type:date;not null"`
	Count     int       `gorm:"default:1"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

// Follow model tracks user following relationships
type Follow struct {
	ID         uint `gorm:"primaryKey"`
	FollowerID uint `gorm:"not null;index"`
	FolloweeID uint `gorm:"not null;index"`
	CreatedAt  time.Time
}

// InitDB initializes the SQLite database
func InitDB(dbPath string) error {
	// Ensure directory exists
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	database, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return err
	}

	// Migrate the schema
	err = database.AutoMigrate(&User{}, &Profile{}, &Contribution{}, &Follow{})
	if err != nil {
		return err
	}

	DB = database
	log.Println("Database initialized and migrated.")
	return nil
}
