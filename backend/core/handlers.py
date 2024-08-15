import os
from datetime import datetime, timedelta, timezone
from random import randint
import jwt
from core.db import find_user, db_insert, find_register, db_update, db_delete, db_read
from core.mail import send_code

# 定义消息字典，用于存储各种操作的返回消息
MESSAGES = {
    "user_not_exist": "用户不存在",
    "login_success": "登录成功",
    "login_failed": "登录失败",
    "email_registered": "邮箱已被注册",
    "verification_code_error": "验证码错误或系统错误",
    "registration_success": "注册成功",
    "token_expired": "令牌已过期",
    "token_invalid": "令牌无效",
    "captcha_sent": "验证码已成功发送",
    "wait_before_resend": "请等待 {seconds} 秒再发送",
    "verification_type_error": "验证类型错误",
    "password_reset_success": "密码重置成功",
    "invalid_parameters": "无效的请求参数",
}

JWT_SECRET = os.getenv('JWT_SECRET')
JWT_EXPIRATION_DELTA = timedelta(days=2)  # 令牌有效期为2天

# 获取当前时间


def get_current_time():
    return datetime.now()


# 处理登录请求
async def handle_login(data):
    email = data.get("email")
    password = data.get("password")
    user = find_user("SeiunSodou", "users", {"email": email})

    # 如果用户不存在，返回错误消息
    if not user:
        return {"code": "403", "message": "user_not_exist", "status": "failed"}

    # 验证密码
    if user["password"] == password:
        # 生成 JWT 令牌
        payload = {
            "uid": user["uid"],
            "exp": datetime.now(timezone.utc) + JWT_EXPIRATION_DELTA,
            "email": user["email"],
            "role": user["role"],
            "iat": datetime.now(timezone.utc),
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

        return {
            "code": "200",
            "message": "login_success",
            "token": token,
            "status": "success",
        }

    # 如果密码不匹配，返回登录失败消息
    return {"code": "403", "message": "login_failed", "status": "failed"}


# 处理发送邮件请求
async def handle_send_mail(data):
    email = data.get("email")
    request_type = data.get("type")

    # 检查请求参数是否有效
    if not email or not request_type or request_type not in ["signup", "reset"]:
        return {"code": "400", "message": "invalid_parameters", "status": "failed"}

    user_exists = find_user("SeiunSodou", "users", {"email": email})
    register_entry = find_register("SeiunSodou", "register", {"email": email})
    current_time = get_current_time()

    # 处理注册请求
    if request_type == "signup":
        if user_exists:
            return {"code": "403", "message": "email_registered", "status": "failed"}

        if register_entry and (current_time - register_entry["time"]).seconds < 60:
            wait_time = 60 - (current_time - register_entry["time"]).seconds
            return {
                "code": "403",
                "message": "wait_before_resend",
                "wait_time": wait_time,
            }

        code = randint(100000, 999999)
        return await send_captcha(email, code, request_type, register_entry)

    # 处理重置密码请求
    if request_type == "reset":
        if not user_exists:
            return {"code": "404", "message": "user_not_exist", "status": "failed"}

        if register_entry and (current_time - register_entry["time"]).seconds < 60:
            wait_time = 60 - (current_time - register_entry["time"]).seconds
            return {
                "code": "403",
                "message": "wait_before_resend",
                "wait_time": wait_time,
            }

        code = randint(100000, 999999)
        return await send_captcha(email, code, request_type, register_entry)


# 发送验证码
async def send_captcha(email, code, request_type, register_entry):
    try:
        send_code(email, code, request_type)
    except Exception as e:
        return {"code": "500", "message": str(e), "status": "failed"}

    # 更新或插入注册表中的验证码信息
    if register_entry:
        db_update(
            "SeiunSodou",
            "register",
            {"email": email},
            {
                "email": email,
                "code": code,
                "type": request_type,
                "time": get_current_time(),
            },
        )
    else:
        db_insert(
            "SeiunSodou",
            "register",
            {
                "email": email,
                "code": code,
                "type": request_type,
                "time": get_current_time(),
            },
        )

    return {"code": "200", "message": "captcha_sent", "status": "success"}


# 处理注册验证请求
async def handle_register_verify(data):
    email = data.get("email")
    code = data.get("code")
    password = data.get("password")

    register_entry = find_register(
        "SeiunSodou", "register", {"email": email, "code": int(code)}
    )

    # 如果验证码匹配且类型为注册，插入用户信息并删除注册表中的记录
    if register_entry and register_entry["type"] == "signup":
        db_insert(
            "SeiunSodou",
            "users",
            {
                "email": email,
                "password": password,
                "register_time": get_current_time(),
                "uid": db_read("SeiunSodou", "users", {}).__len__() + 1,
                "role": "user",
            },
        )
        db_delete("SeiunSodou", "register", {"email": email})
        return {"code": "200", "message": "registration_success", "status": "success"}

    return {"code": "403", "message": "verification_code_error", "status": "failed"}


# 处理会话验证请求
async def handle_verify(token):
    try:
        # 解码并验证 JWT 令牌
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        # 如果验证成功，返回成功消息
        return {
            "code": "200",
            "message": "login_success",
            "uid": payload["uid"],
            "tokenCreated": payload["exp"],
            "status": "success",
        }
    except jwt.ExpiredSignatureError:
        # 如果令牌已过期，返回令牌过期消息
        return {"code": "403", "message": "token_expired", "status": "failed"}
    except jwt.InvalidTokenError:
        # 如果令牌无效，返回无效令牌消息
        return {"code": "403", "message": "token_invalid", "status": "failed"}


# 处理重置密码请求
async def handle_reset_password(data):
    email = data.get("email")
    code = data.get("code")
    new_password = data.get("newPassword")

    register_entry = find_register(
        "SeiunSodou", "register", {"email": email, "code": int(code)}
    )

    # 如果验证码匹配且类型为重置密码，更新用户密码并删除注册表中的记录
    if register_entry and register_entry["type"] == "reset":
        db_update(
            "SeiunSodou",
            "users",
            {"email": email},
            {"password": new_password}
        )
        db_delete(
            "SeiunSodou",
            "register",
            {"email": email}
        )
        return {"code": "200", "message": "password_reset_success", "status": "success"}

    return {"code": "403", "message": "verification_code_error", "status": "failed"}
