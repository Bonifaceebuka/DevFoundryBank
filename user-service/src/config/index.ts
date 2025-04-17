export const CONFIGS ={
    HTTP_ALLOWED_HEADERS: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "X-Requested-With",
        "x-jwt-token",
        "x-jwt-refresh-token",
        "Content-Length",
        "Accept-Language",
        "Accept-Encoding",
        "Connection",
        "Access-Control-Allow-Origin"
    ],
    HTTP_METHODS:["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    SERVICES_COR_ORIGINS: [
        "http://localhost:2026", // API Gateway
        "http://localhost:2025", // User service
        "http://localhost:2027",  // Notification
        "http://localhost:2029"  // Wallet
    ]
}