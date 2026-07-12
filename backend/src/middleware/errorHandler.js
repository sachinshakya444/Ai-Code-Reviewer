/**
 * Global Error Handler Middleware
 * Saari app ki errors yahan aati hain
 * Express mein 4 parameters wala function = error handler hota hai
 */
export function errorHandler(err, req, res, next) {
  console.error(`❌ Error: ${err.message}`);

  // Default status code 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Something went wrong. Please try again.",

    // Development mein stack trace dikhao, production mein nahi
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

/**
 * 404 Handler — koi route match nahi hua
 * index.js mein routes ke baad lagao
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
}