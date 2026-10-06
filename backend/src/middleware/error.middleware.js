const ApiError = require("../utils/ApiError");

exports.notFound = (req, res, next) =>
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

exports.errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.isAxiosError) {
    status = err.response?.status === 404 ? 404 : 502;
    message = status === 404 ? "Not found on TMDB" : "TMDB request failed";
  } else if (err.name === "ValidationError") {
    status = 400;
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid value";
  }

  if (status >= 500) console.error(err);
  res.status(status).json({ message });
};
