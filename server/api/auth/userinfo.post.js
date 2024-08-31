import jwt from "jsonwebtoken";
import { db_find } from "~/server/lib/db";

const RuntimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const headers = getRequestHeaders(event);
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { code: "403", message: "authorization_header_missing_or_invalid", status: "failed" };
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, RuntimeConfig.JWT_SECRET, { algorithms: ["HS256"] });

        const uid = payload.uid;

        const userDataCollection = await db_find("SeiunSodou", "user_data", { uid: uid });

        const userSignCollection = await db_find("SeiunSodou", "users", { uid: uid });

        return {
            uid: uid,
            avatar: userDataCollection.avatar,
            nick: userDataCollection.nick,
            bio: userDataCollection.bio,
            post_count: userDataCollection.post_count,
            register_time: userSignCollection.register_time,
            email: userSignCollection.email
        }

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            // 如果令牌已过期，返回令牌过期消息
            return { code: "403", message: "token_expired", status: "failed" };
        } else if (err instanceof jwt.JsonWebTokenError) {
            // 如果令牌无效，返回无效令牌消息
            return { code: "403", message: "token_invalid", status: "failed" };
        } else {
            // 处理其他错误
            return { code: "500", message: "internal_server_error", status: "failed" };
        }
    }
});
