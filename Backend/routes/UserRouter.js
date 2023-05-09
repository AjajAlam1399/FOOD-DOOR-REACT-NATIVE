import express from "express";

import { Register, login, logout } from "../controllers/UserController.js";
import { isAuthenticatedUser } from "../middleware/Auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticatedUser, logout);
export default router;
