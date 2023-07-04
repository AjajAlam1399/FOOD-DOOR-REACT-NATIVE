import express from "express";

import { Register, loadUser, login, logout, resendOTP, verifyUser } from "../controllers/UserController.js";
import { isAuthenticatedUser } from "../middleware/Auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticatedUser, logout);
router.route('/me').get(isAuthenticatedUser, loadUser);
router.route('/new/user/verify').post(isAuthenticatedUser,verifyUser)
router.route('/new/user/otp').post(isAuthenticatedUser,resendOTP)
export default router;
