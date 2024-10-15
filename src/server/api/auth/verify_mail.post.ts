import { db_find, db_update, db_insert, db_delete, db_read } from "@/server/utils/db";
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const email = body.email;
    const requestType = body.type;
    const verificationCode = body.code;
    const password = body.password;

    const pending_verifications_entry = await db_find(
        "SeiunSodou", "pending_verifications", { "email": email, "code": parseInt(verificationCode) }
    );
    // 处理注册请求
    if (requestType === "signup" && pending_verifications_entry) {
        const userUid = (await db_read("SeiunSodou", "users", {})).length + 1
        db_insert("SeiunSodou", "users", {
            "email": email,
            "password": bcrypt.hashSync(password, 10),
            "register_time": getCurrentTime(),
            "uid": userUid,
            "role": "user",
        });
        db_insert("SeiunSodou", "user_data", {
            "uid": userUid,
            "avatar": "https://cdn.moefan.top/images/none.webp",
            "nick": `User ${userUid}`,
            "post_count": 0,
            "bio": "这里还空空如也哦"
        });
        db_delete("SeiunSodou", "pending_verifications", { "email": email });
        return { "code": "200", "message": "registration_success", "status": "success" };
    }

    // 处理重置密码请求
    if (requestType === "reset" && pending_verifications_entry) {
        db_update("SeiunSodou", "users", { "email": email }, { "password": bcrypt.hashSync(password, 10) })
        db_delete("SeiunSodou", "pending_verifications", { "email": email })
        return { "code": "200", "message": "password_reset_success", "status": "success" }
    }

    return { "code": "403", "message": "verification_code_error", "status": "failed" }
});

function getCurrentTime() {
    return new Date().getTime();
}