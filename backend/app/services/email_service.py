import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger("app.services.email_service")


def send_password_reset_email(to_email: str, otp_code: str, user_name: str | None = None) -> bool:
    """
    Sends a password reset email with the OTP code.
    If SMTP credentials are configured in .env, sends via SMTP.
    Otherwise, logs the OTP prominently to the backend console.
    """
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port_str = os.getenv("SMTP_PORT", "587")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM") or smtp_user or "noreply@astroguide.com"
    app_name = os.getenv("APP_NAME", "AstroGuide")

    # Always log the OTP code to terminal/logs for development & auditing
    log_banner = f"""
======================================================================
[ASTROGUIDE PASSWORD RESET]
To: {to_email}
User: {user_name or 'Seeker'}
Reset Code (OTP): {otp_code}
Valid for: 15 minutes
======================================================================
"""
    logger.info(log_banner)
    print(log_banner, flush=True)

    # If SMTP is not configured, return False but do not error out
    if not smtp_host or not smtp_user or not smtp_password:
        logger.info(
            "SMTP credentials not fully configured (SMTP_HOST/USER/PASSWORD). "
            "Simulated email logged to console."
        )
        return False

    try:
        smtp_port = int(smtp_port_str)
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"{app_name} — Password Reset Code: {otp_code}"
        msg["From"] = f"{app_name} <{smtp_from}>"
        msg["To"] = to_email

        greeting = f"Hello {user_name}," if user_name else "Greetings Seeker,"

        plain_text = f"""{greeting}

We received a request to reset your password for your {app_name} account.

Your single-use password reset verification code is:
{otp_code}

This code is valid for 15 minutes.

If you did not make this request, you can safely ignore this email. Your account remains secure.

Celestial Regards,
The {app_name} Team
"""

        html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0c0f1d;
      color: #e2e8f0;
      margin: 0;
      padding: 20px;
    }}
    .email-card {{
      max-width: 500px;
      margin: 0 auto;
      background: #141829;
      border: 1px solid #2d3748;
      border-radius: 12px;
      padding: 32px 24px;
      text-align: center;
    }}
    .brand-title {{
      font-size: 24px;
      font-weight: bold;
      color: #e2e8f0;
      margin-bottom: 8px;
    }}
    .gold {{
      color: #ecc94b;
    }}
    .subtitle {{
      color: #a0aec0;
      font-size: 14px;
      margin-bottom: 24px;
    }}
    .otp-box {{
      background: #1a202c;
      border: 2px dashed #ecc94b;
      border-radius: 8px;
      padding: 16px;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 6px;
      color: #ecc94b;
      margin: 24px 0;
      display: inline-block;
      width: 80%;
    }}
    .info-text {{
      font-size: 14px;
      color: #cbd5e0;
      line-height: 1.6;
    }}
    .footer-text {{
      margin-top: 32px;
      font-size: 12px;
      color: #718096;
      border-top: 1px solid #2d3748;
      padding-top: 16px;
    }}
  </style>
</head>
<body>
  <div class="email-card">
    <div class="brand-title">✦ Astro<span class="gold">Guide</span></div>
    <div class="subtitle">Celestial Password Assistance</div>
    <p class="info-text">{greeting}</p>
    <p class="info-text">You requested to reset your password. Use the verification code below to complete the reset:</p>
    <div class="otp-box">{otp_code}</div>
    <p class="info-text">This code will expire in <strong>15 minutes</strong>.</p>
    <p class="info-text">If you did not request a password reset, you can safely ignore this message.</p>
    <div class="footer-text">
      &copy; AstroGuide Celestial Services. All rights reserved.
    </div>
  </div>
</body>
</html>
"""

        msg.attach(MIMEText(plain_text, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        use_ssl = os.getenv("SMTP_SSL", "false").lower() in ("true", "1", "yes")

        if use_ssl or smtp_port == 465:
            with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10) as server:
                server.login(smtp_user, smtp_password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.send_message(msg)

        logger.info(f"Password reset email sent to {to_email} via SMTP")
        return True

    except Exception as exc:
        logger.error(f"Failed to send email via SMTP to {to_email}: {exc}")
        return False
