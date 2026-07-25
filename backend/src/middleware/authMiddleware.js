import jwt from "jsonwebtoken";

/**
 * Protected routes ke liye — JWT token verify karta hai
 * Agar token nahi hai ya invalid hai toh 401 return karta hai
 */
export function requireAuth(req, res, next) {
  try {
    // Token cookie se lo
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Please login with GitHub to continue",
      });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
     console.log("❌ Token error:", err.message);
    return res.status(401).json({
      success: false,
      error: "Session expired. Please login again.",
    });
  }
}

/**
 * Optional auth — login ho toh user attach karo, nahi toh bhi chalne do
 * Public PR review ke liye use hoga
 */
export function optionalAuth(req, res, next) {
  try {
    console.log("🍪 All cookies:", req.cookies); // YEH ADD KARO
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔑 Decoded token:", decoded);
      req.user = decoded;
    }
  } catch (err) {
    console.log("❌ Token error:", err.message);
  }
  next();
}