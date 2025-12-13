package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/imLaanui/Financeu-platform/backend/internal/utils"
)

// AuthMiddleware validates JWT tokens and adds user info to the context
func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Try to get token from cookie first
		token, err := c.Cookie("token")

		// If not in cookie, try Authorization header
		if err != nil || token == "" {
			authHeader := c.GetHeader("Authorization")
			if authHeader == "" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
				c.Abort()
				return
			}

			// Extract token from "Bearer <token>"
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header"})
				c.Abort()
				return
			}
			token = parts[1]
		}

		// Verify token
		claims, err := utils.VerifyToken(token, jwtSecret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Set user info in context so handlers can access it
		c.Set("userID", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("name", claims.Name)
		c.Set("membershipTier", claims.MembershipTier)

		c.Next()
	}
}

// RequireTier middleware checks if user has required membership tier
func RequireTier(requiredTier string) gin.HandlerFunc {
	tierLevels := map[string]int{
		"free":    0,
		"premium": 1,
		"pro":     2,
	}

	return func(c *gin.Context) {
		userTier, exists := c.Get("membershipTier")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Membership tier not found"})
			c.Abort()
			return
		}

		userTierStr := userTier.(string)
		userLevel := tierLevels[userTierStr]
		requiredLevel := tierLevels[requiredTier]

		if userLevel < requiredLevel {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Upgrade your membership to access this content",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
