import jwt from "jsonwebtoken";
import { db_find } from "@/server/utils/db";

const RuntimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event): Promise<UserInfoResponse> => {

    const headers = getRequestHeaders(event);
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { code: "403", message: "authorization_header_missing_or_invalid", status: "failed" };
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, RuntimeConfig.JWT_SECRET, { algorithms: ["HS256"] }) as JWTPayload;

        const uid = payload.uid;

        const userDataCollection = await db_find("SeiunSodou", "user_data", { uid: uid });

        const userSignCollection = await db_find("SeiunSodou", "users", { uid: uid });

        return {
            code: "200",
            data: {
                uid: uid,
                avatar: userDataCollection.avatar,
                nick: userDataCollection.nick,
                bio: userDataCollection.bio,
                post_count: userDataCollection.post_count,
                register_time: userSignCollection.register_time,
                email: userSignCollection.email,
            },
            status: "success"
        }

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return { code: "403", message: "token_expired", status: "failed" };
        } else if (err instanceof jwt.JsonWebTokenError) {
            return { code: "403", message: "token_invalid", status: "failed" };
        } else {
            return { code: "500", message: "internal_server_error", status: "failed" };
        }
    }
});