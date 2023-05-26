import express from "express";

import { Register, loadUser, login, logout } from "../controllers/UserController.js";
import { isAuthenticatedUser } from "../middleware/Auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticatedUser, logout);
router.route('/me').get(isAuthenticatedUser, loadUser);
export default router;
