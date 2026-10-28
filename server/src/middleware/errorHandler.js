// Global error handler — mount as last middleware in app.js
export function errorHandler(err, req, res, next) {
  // Log full error in development only
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${req.method} ${req.url}:`, err);
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status,
  });
}
