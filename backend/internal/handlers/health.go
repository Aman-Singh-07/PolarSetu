package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthCheck returns { "status": "ok" }.
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
