import { db_find } from "@/server/utils/db";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

const RuntimeConfig = useRuntimeConfig();

const JWT_EXPIRATION_DELTA = 2 * 24 * 60 * 60;

export default defineEventHandler(async (event) => {

  const body = await readBody(event)
  const email = body.email;
  const password = body.password;
  const user = await db_find("SeiunSodou", "users", { email: email });

  if (!user) {
    return {
      code: "403",
      message: "user_not_exist",
      status: "failed"
    };
  }
  if (bcrypt.compareSync(password, user.password)) {
    const payload: JWTPayload = {
      uid: user.uid,
      exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION_DELTA,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    };
    const token = jwt.sign(payload, RuntimeConfig.JWT_SECRET, { algorithm: "HS256" });

    return {
      code: "200",
      message: "login_success",
      token: token,
      status: "success"
    };
  }

  return {
    code: "403",
    message: "login_failed",
    status: "failed"
  };
});