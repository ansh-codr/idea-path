/**
 * Firebase Admin Authentication Middleware
 * ========================================
 * Verifies Firebase ID tokens from the frontend.
 * 
 * For hackathon/demo: Uses simplified verification.
 * For production: Use Firebase Admin SDK.
 */

import config from "../config/index.js";

// In-memory user cache (for demo purposes)
const userCache = new Map();

/**
 * Extract Bearer token from Authorization header
 */
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * Verify Firebase ID Token
 * 
 * For production, use Firebase Admin SDK:
 * const admin = require('firebase-admin');
 * admin.auth().verifyIdToken(token);
 * 
 * For demo, we trust the token and decode the payload.
 */
const verifyToken = async (token) => {
  try {
    // Demo mode: Decode JWT payload without verification
    // IMPORTANT: For production, use Firebase Admin SDK!
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format" };
    }
    
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf8")
    );
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token expired" };
    }
    
    // Extract user info
    const user = {
      uid: payload.user_id || payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
    
    // Cache user
    userCache.set(user.uid, {
      ...user,
      cachedAt: Date.now(),
    });
    
    return { valid: true, user };
  } catch (error) {
    console.error("[Auth] Token verification error:", error.message);
    return { valid: false, error: "Token verification failed" };
  }
};

/**
 * Authentication Middleware (Required)
 * Blocks requests without valid authentication.
 */
export const requireAuth = async (req, res, next) => {
  const token = extractToken(req.headers.authorization);
  
  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please sign in to access this resource.",
    });
  }
  
  const result = await verifyToken(token);
  
  if (!result.valid) {
    return res.status(401).json({
      error: "Invalid authentication",
      message: result.error,
    });
  }
  
  // Attach user to request
  req.user = result.user;
  next();
};

/**
 * Authentication Middleware (Optional)
 * Attaches user if authenticated, but allows anonymous access.
 */
export const optionalAuth = async (req, res, next) => {
  const token = extractToken(req.headers.authorization);
  
  if (token) {
    const result = await verifyToken(token);
    if (result.valid) {
      req.user = result.user;
    }
  }
  
  next();
};

/**
 * Get cached user by UID
 */
export const getCachedUser = (uid) => {
  const cached = userCache.get(uid);
  if (!cached) return null;
  
  // Cache expires after 1 hour
  if (Date.now() - cached.cachedAt > 3600000) {
    userCache.delete(uid);
    return null;
  }
  
  return cached;
};

/**
 * Clear user from cache
 */
export const clearUserCache = (uid) => {
  userCache.delete(uid);
};

export default { requireAuth, optionalAuth, getCachedUser, clearUserCache };
