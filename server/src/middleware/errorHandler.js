/**
 * Error Handler Middleware
 */

function errorHandler(err, req, res, next) {
    console.error('❌ Server Error:', err.message);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Sunucu hatası oluştu';

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        error: `${req.method} ${req.originalUrl} bulunamadı`
    });
}

module.exports = { errorHandler, notFoundHandler };
