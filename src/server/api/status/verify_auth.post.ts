import jwt from "jsonwebtoken";

const RuntimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    
    const headers = getRequestHeaders(event);
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { code: "403", message: "authorization_header_missing_or_invalid", status: "failed" };
    }

    const token = authHeader.split(" ")[1];

    try {
        // 解码并验证 JWT 令牌
        const payload = jwt.verify(token, RuntimeConfig.JWT_SECRET, { algorithms: ["HS256"] }) as JWTPayload;

        // 如果验证成功，返回成功消息
        return {
            code: "200",
            message: "login_success",
            uid: payload.uid,
            tokenCreated: payload.exp,
            status: "success",
        };
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
