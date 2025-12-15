// Package email provides email sending functionality for the application.
package email

import (
	"fmt"
	"os"

	"gopkg.in/gomail.v2"
)

// Service handles email sending operations
type Service struct {
	dialer      *gomail.Dialer
	fromEmail   string
	fromName    string
	frontendURL string
}

// NewService creates a new email service instance
func NewService() *Service {
	gmailUser := os.Getenv("GMAIL_USER")
	gmailPass := os.Getenv("GMAIL_PASS")
	frontendURL := os.Getenv("FRONTEND_URL")

	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	// Gmail SMTP settings
	dialer := gomail.NewDialer("smtp.gmail.com", 587, gmailUser, gmailPass)

	return &Service{
		dialer:      dialer,
		fromEmail:   gmailUser,
		fromName:    "FinanceU",
		frontendURL: frontendURL,
	}
}

// SendVerificationEmail sends an email verification link to a new user
func (s *Service) SendVerificationEmail(toEmail, userName, token string) error {
	verificationLink := fmt.Sprintf("%s/verify-email?token=%s&email=%s", s.frontendURL, token, toEmail)

	subject := "Verify Your FinanceU Account"
	htmlBody := s.verificationEmailTemplate(userName, verificationLink)
	plainBody := fmt.Sprintf(
		"Hi %s,\n\nWelcome to FinanceU! Please verify your email address by clicking the link below:\n\n%s\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, please ignore this email.\n\nBest regards,\nThe FinanceU Team",
		userName, verificationLink,
	)

	return s.sendEmail(toEmail, subject, htmlBody, plainBody)
}

// SendPasswordResetEmail sends a password reset link
func (s *Service) SendPasswordResetEmail(toEmail, userName, token string) error {
	resetLink := fmt.Sprintf("%s/reset-password?token=%s&email=%s", s.frontendURL, token, toEmail)

	subject := "Reset Your FinanceU Password"
	htmlBody := s.passwordResetEmailTemplate(userName, resetLink)
	plainBody := fmt.Sprintf(
		"Hi %s,\n\nWe received a request to reset your password. Click the link below to create a new password:\n\n%s\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe FinanceU Team",
		userName, resetLink,
	)

	return s.sendEmail(toEmail, subject, htmlBody, plainBody)
}

// sendEmail sends an email using the configured SMTP settings
func (s *Service) sendEmail(to, subject, htmlBody, plainBody string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", fmt.Sprintf("%s <%s>", s.fromName, s.fromEmail))
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", plainBody)
	m.AddAlternative("text/html", htmlBody)

	if err := s.dialer.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}

// verificationEmailTemplate returns the HTML template for verification emails
func (s *Service) verificationEmailTemplate(userName, verificationLink string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Finance<span style="color: #ffd700;">U</span></h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Welcome to FinanceU, %s! 🎉</h2>
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                                Thanks for signing up! We're excited to help you on your financial literacy journey.
                            </p>
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                To get started, please verify your email address by clicking the button below:
                            </p>

                            <!-- Button -->
                            <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="%s" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #666666; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                                Or copy and paste this link into your browser:
                            </p>
                            <p style="color: #667eea; line-height: 1.6; margin: 10px 0 0 0; font-size: 14px; word-break: break-all;">
                                %s
                            </p>

                            <p style="color: #999999; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                                This link will expire in 24 hours. If you didn't create an account, please ignore this email.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="color: #999999; margin: 0; font-size: 12px;">
                                © 2024 FinanceU. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`, userName, verificationLink, verificationLink)
}

// passwordResetEmailTemplate returns the HTML template for password reset emails
func (s *Service) passwordResetEmailTemplate(userName, resetLink string) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Finance<span style="color: #ffd700;">U</span></h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password 🔒</h2>
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                                Hi %s,
                            </p>
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                We received a request to reset your password. Click the button below to create a new password:
                            </p>

                            <!-- Button -->
                            <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="%s" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #666666; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                                Or copy and paste this link into your browser:
                            </p>
                            <p style="color: #667eea; line-height: 1.6; margin: 10px 0 0 0; font-size: 14px; word-break: break-all;">
                                %s
                            </p>

                            <p style="color: #999999; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
                                This link will expire in 1 hour. If you didn't request this, please ignore this email.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="color: #999999; margin: 0; font-size: 12px;">
                                © 2024 FinanceU. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`, userName, resetLink, resetLink)
}
