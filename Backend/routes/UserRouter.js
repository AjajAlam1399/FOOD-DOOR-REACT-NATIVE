import express from "express";

import { Register, loadUser, login, logout, verifyUser } from "../controllers/UserController.js";
import { isAuthenticatedUser } from "../middleware/Auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticatedUser, logout);
router.route('/me').get(isAuthenticatedUser, loadUser);
router.route('/new/user/verify').post(isAuthenticatedUser,verifyUser)
export default router;
