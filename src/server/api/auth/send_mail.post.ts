import { db_find, db_update, db_insert } from "@/server/utils/db";
import { sendCode } from "@/server/utils/mail";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    const email = body.email;
    const requestType = body.type;

    // 检查请求参数是否有效
    if (!email || !requestType || !["signup", "reset"].includes(requestType)) {
        setResponseStatus(event, 404);
        event.node.res.end(JSON.stringify({ code: "400", message: "invalid_parameters", status: "failed", data: body }));
        return;
    }

    const userExists = await db_find("SeiunSodou", "users", { email: email });
    const registerEntry = await db_find("SeiunSodou", "pending_verifications", { email: email });
    const currentTime = getCurrentTime();

    // 处理注册请求
    if (requestType === "signup") {
        if (userExists) {
            event.node.res.statusCode = 403;
            event.node.res.end(JSON.stringify({ code: "403", message: "email_registered", status: "failed" }));
            return;
        }

        if (registerEntry) {
            const currentTimeMs = new Date(currentTime).getTime();
            const registerEntryTimeMs = new Date(registerEntry.time).getTime();
            const timeDifferenceSeconds = (currentTimeMs - registerEntryTimeMs) / 1000;

            if (timeDifferenceSeconds < 60) {
                const waitTime = 60 - Math.floor(timeDifferenceSeconds);
                event.node.res.statusCode = 403;
                event.node.res.end(JSON.stringify({
                    code: "403",
                    message: "wait_before_resend",
                    wait_time: waitTime,
                }));
                return;
            }
        }

        const code = Math.floor(Math.random() * 900000) + 100000;
        await sendCaptcha(email, code, requestType, registerEntry);
        event.node.res.statusCode = 200;
        event.node.res.end(JSON.stringify({ code: "200", message: "captcha_sent", status: "success" }));
        return;
    }

    // 处理重置密码请求
    if (requestType === "reset") {
        if (!userExists) {
            event.node.res.statusCode = 404;
            event.node.res.end(JSON.stringify({ code: "404", message: "user_not_exist", status: "failed" }));
            return;
        }

        if (registerEntry) {
            const currentTimeMs = new Date(currentTime).getTime();
            const registerEntryTimeMs = new Date(registerEntry.time).getTime();
            const timeDifferenceSeconds = (currentTimeMs - registerEntryTimeMs) / 1000;

            if (timeDifferenceSeconds < 60) {
                const waitTime = 60 - Math.floor(timeDifferenceSeconds);
                event.node.res.statusCode = 403;
                event.node.res.end(JSON.stringify({
                    code: "403",
                    message: "wait_before_resend",
                    wait_time: waitTime,
                }));
                return;
            }
        }

        const code = Math.floor(Math.random() * 900000) + 100000;
        await sendCaptcha(email, code, requestType, registerEntry);
        event.node.res.statusCode = 200;
        event.node.res.end(JSON.stringify({ code: "200", message: "captcha_sent", status: "success" }));
        return;
    }
});

async function sendCaptcha(email: string, code: number, requestType: string, registerEntry: string) {
    try {
        sendCode(email, code, requestType);
    } catch (e) {
        const error = e as Error;
        return { code: "500", message: error.toString(), status: "failed" };
    }
    // 更新或插入注册表中的验证码信息
    if (registerEntry) {
        db_update(
            "SeiunSodou",
            "pending_verifications",
            { email: email },
            {
                email: email,
                code: code,
                type: requestType,
                time: getCurrentTime(),
            }
        );
    } else {
        db_insert(
            "SeiunSodou",
            "pending_verifications",
            {
                email: email,
                code: code,
                type: requestType,
                time: getCurrentTime(),
            }
        );
    }

    return { code: "200", message: "captcha_sent", status: "success" };
}

function getCurrentTime() {
    return new Date().getTime();
}