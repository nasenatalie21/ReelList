const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { JWT_SECRET } = require("../config/env");

function parse(req) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  try {
    return { id: jwt.verify(token, JWT_SECRET).id };
  } catch {
    return null;
  }
}

exports.required = (req, res, next) => {
  const user = parse(req);
  if (!user) return next(new ApiError(401, "Please log in"));
  req.user = user;
  next();
};

exports.optional = (req, res, next) => {
  req.user = parse(req);
  next();
};
