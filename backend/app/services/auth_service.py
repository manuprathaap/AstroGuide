from datetime import datetime, timedelta, timezone
import os
import secrets
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
)
from app.services.email_service import send_password_reset_email


def register_user(
    db: Session,
    user_data: RegisterRequest,
) -> User:
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email.strip().lower())
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    user = User(
        full_name=user_data.full_name.strip(),
        email=user_data.email.strip().lower(),
        password_hash=hash_password(user_data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(
    db: Session,
    login_data: LoginRequest,
) -> str:
    user = (
        db.query(User)
        .filter(User.email == login_data.email.strip().lower())
        .first()
    )

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(
        login_data.password,
        user.password_hash,
    ):
        raise ValueError("Invalid email or password")

    if not user.is_active:
        raise ValueError("User account is inactive")

    return create_access_token(user.id)


def request_password_reset(db: Session, email: str) -> dict:
    normalized_email = email.strip().lower()
    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    is_dev = os.getenv("APP_ENV", "development").lower() == "development"

    generic_message = (
        "If this email is registered in our celestial records, a password reset code has been sent."
    )

    if not user or not user.is_active:
        msg = (
            f"The email '{normalized_email}' was not found. Please register first or use a registered email address."
            if is_dev
            else generic_message
        )
        return {"message": msg, "dev_otp": None}


    otp_code = f"{secrets.randbelow(900000) + 100000}"
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=15)


    # Invalidate previous unused tokens for this user
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.is_used == False,
    ).update({"is_used": True})

    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        otp_code=otp_code,
        expires_at=expires_at,
        is_used=False,
    )
    db.add(reset_token)
    db.commit()

    email_sent = send_password_reset_email(
        to_email=user.email,
        otp_code=otp_code,
        user_name=user.full_name,
    )

    is_dev = os.getenv("APP_ENV", "development").lower() == "development"
    dev_otp = otp_code if (is_dev or not email_sent) else None

    return {
        "message": generic_message,
        "dev_otp": dev_otp,
    }


def verify_reset_otp(db: Session, email: str, code: str) -> dict:
    normalized_email = email.strip().lower()
    clean_code = code.strip()

    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if not user or not user.is_active:
        raise ValueError("Invalid email address or verification code.")

    reset_entry = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.is_used == False,
            (
                (PasswordResetToken.otp_code == clean_code) |
                (PasswordResetToken.token == clean_code)
            ),
        )
        .order_by(PasswordResetToken.id.desc())
        .first()
    )

    if not reset_entry:
        raise ValueError("Invalid verification code. Please check and try again.")

    if reset_entry.expires_at < datetime.now(timezone.utc).replace(tzinfo=None):
        raise ValueError("This verification code has expired. Please request a new code.")

    return {
        "valid": True,
        "message": "OTP verification successful.",
        "reset_token": reset_entry.token,
    }


def reset_password_with_code(db: Session, reset_data: ResetPasswordRequest) -> None:
    normalized_email = reset_data.email.strip().lower()
    code = reset_data.code.strip()


    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if not user or not user.is_active:
        raise ValueError("Invalid email address or reset code.")

    reset_entry = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.is_used == False,
            (
                (PasswordResetToken.otp_code == code) |
                (PasswordResetToken.token == code)
            ),
        )
        .order_by(PasswordResetToken.id.desc())
        .first()
    )

    if not reset_entry:
        raise ValueError("Invalid reset code. Please check and try again.")

    if reset_entry.expires_at < datetime.now(timezone.utc).replace(tzinfo=None):
        raise ValueError("This reset code has expired. Please request a new code.")


    user.password_hash = hash_password(reset_data.new_password)
    reset_entry.is_used = True
    db.commit()


def change_user_password(db: Session, user: User, change_data: ChangePasswordRequest) -> None:
    if not verify_password(change_data.current_password, user.password_hash):
        raise ValueError("Current password is incorrect.")

    if change_data.current_password == change_data.new_password:
        raise ValueError("New password must be different from current password.")

    user.password_hash = hash_password(change_data.new_password)
    db.commit()