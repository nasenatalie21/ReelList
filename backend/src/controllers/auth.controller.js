const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");

const sign = (user) =>
  jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const payload = (user) => ({
  token: sign(user),
  user: { id: user._id, email: user.email },
});

const emailOk = (e) => typeof e === "string" && /^\S+@\S+\.\S+$/.test(e);

exports.register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!emailOk(email)) throw new ApiError(400, "A valid email is required");
  if (typeof password !== "string" || password.length < 8)
    throw new ApiError(400, "Password must be at least 8 characters");
  if (await User.findOne({ email: email.toLowerCase() }))
    throw new ApiError(409, "Email already registered");

  const user = await User.create({
    email,
    passwordHash: await bcrypt.hash(password, 10),
  });
  res.status(201).json(payload(user));
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!emailOk(email) || typeof password !== "string")
    throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    throw new ApiError(401, "Invalid email or password");

  res.json(payload(user));
});
