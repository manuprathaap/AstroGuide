import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_password_reset_flow():
    # 1. Register a test user
    unique_email = f"reset_test_{uuid.uuid4().hex[:8]}@example.com"
    initial_password = "OldPassword123!"

    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Reset Test User",
            "email": unique_email,
            "password": initial_password,
        },
    )
    assert reg_resp.status_code == 201

    # 2. Forgot password request
    forgot_resp = client.post(
        "/api/v1/auth/forgot-password",
        json={"email": unique_email},
    )
    assert forgot_resp.status_code == 200
    forgot_data = forgot_resp.json()
    assert "message" in forgot_data
    otp_code = forgot_data.get("dev_otp")
    assert otp_code is not None, "dev_otp should be provided in dev mode"

    # 3. Attempt verify with invalid code
    bad_verify_resp = client.post(
        "/api/v1/auth/verify-otp",
        json={"email": unique_email, "code": "000000"},
    )
    assert bad_verify_resp.status_code == 400

    # 4. Successful verify with valid OTP code
    good_verify_resp = client.post(
        "/api/v1/auth/verify-otp",
        json={"email": unique_email, "code": otp_code},
    )
    assert good_verify_resp.status_code == 200
    verify_data = good_verify_resp.json()
    assert verify_data["valid"] is True
    assert "reset_token" in verify_data
    reset_token = verify_data["reset_token"]

    # 5. Attempt reset with invalid code
    bad_reset_resp = client.post(
        "/api/v1/auth/reset-password",
        json={
            "email": unique_email,
            "code": "000000",
            "new_password": "NewPassword456!",
        },
    )
    assert bad_reset_resp.status_code == 400

    # 6. Successful reset with the verified token
    new_password = "NewPassword456!"
    good_reset_resp = client.post(
        "/api/v1/auth/reset-password",
        json={
            "email": unique_email,
            "code": reset_token,
            "new_password": new_password,
        },
    )
    assert good_reset_resp.status_code == 200
    assert "successfully reset" in good_reset_resp.json()["message"]


    # 5. Old password no longer works
    old_login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": initial_password},
    )
    assert old_login_resp.status_code == 401

    # 6. New password logs in successfully
    new_login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": new_password},
    )
    assert new_login_resp.status_code == 200
    token = new_login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 7. Change password with wrong current password fails
    bad_change_resp = client.post(
        "/api/v1/auth/change-password",
        headers=headers,
        json={
            "current_password": "WrongPassword123!",
            "new_password": "ThirdPassword789!",
        },
    )
    assert bad_change_resp.status_code == 400

    # 8. Change password with correct current password succeeds
    third_password = "ThirdPassword789!"
    good_change_resp = client.post(
        "/api/v1/auth/change-password",
        headers=headers,
        json={
            "current_password": new_password,
            "new_password": third_password,
        },
    )
    assert good_change_resp.status_code == 200

    # 9. Log in with third password
    third_login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": third_password},
    )
    assert third_login_resp.status_code == 200


def test_forgot_password_nonexistent_email():
    # Should safely return generic message without error
    resp = client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "nonexistent_seeker_xyz@example.com"},
    )
    assert resp.status_code == 200
    assert "message" in resp.json()
