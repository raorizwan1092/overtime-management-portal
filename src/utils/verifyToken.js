import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const token = req?.cookies?.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
