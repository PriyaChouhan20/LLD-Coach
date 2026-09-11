export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.url} ->`, err);

  const statusCode = err.statusCode || (err.message?.includes('not found') ? 404 : 500);
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
