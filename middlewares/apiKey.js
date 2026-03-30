module.exports = function apiKey(req, res, next) {
  const key = req.header("x-api-key");

  if (!process.env.API_KEY) {
    return res.status(500).json({
      error: "ServerMisconfiguration",
      message: "API_KEY not configured"
    });
  }

  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or missing API key"
    });
  }
  next();
};