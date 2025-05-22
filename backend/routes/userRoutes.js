import express from "express";

import protect from "../middleware/authMiddleware.js";
import { login, me, register } from "../controllers/userController.js";

const router = express.Router();

// @route   GET /api/users/me
// @desc    Profile view of logged in user
// @access  Private
router.get("/me", protect, me);

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", register);

//@route POST /api/users/login
//@desc Login registered users
//@access Public
router.post("/login", login);

export default router;
