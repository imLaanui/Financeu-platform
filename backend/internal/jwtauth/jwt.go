// Package jwtauth provides general-purpose utility functions, specifically including JWT token generation and validation.
package jwtauth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/imLaanui/Financeu-platform/backend/internal/models"
)

// Claims represents the JWT claims structure
type Claims struct {
	UserID         int    `json:"id"`
	Email          string `json:"email"`
	Name           string `json:"name"`
	Role           string `json:"role"`
	MembershipTier string `json:"membershipTier"`
	jwt.RegisteredClaims
}

// GenerateToken creates a new JWT token for a user
func GenerateToken(user *models.User, secret string, expiry time.Duration) (string, error) {
	claims := Claims{
		UserID:         user.ID,
		Email:          user.Email,
		Name:           user.Name,
		Role:           user.Role,
		MembershipTier: user.MembershipTier,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", fmt.Errorf("error signing token: %w", err)
	}

	return tokenString, nil
}

// VerifyToken validates a JWT token and returns the claims
func VerifyToken(tokenString, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Verify signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}

	return claims, nil
}
