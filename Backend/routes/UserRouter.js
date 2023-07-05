import express from "express";

import { Register, forgetPassword, loadUser, login, logout, resendOTP, resetPassword, verifyUser } from "../controllers/UserController.js";
import { isAuthenticatedUser } from "../middleware/Auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticatedUser, logout);
router.route('/me').get(isAuthenticatedUser, loadUser);
router.route('/new/user/verify').post(isAuthenticatedUser,verifyUser)
router.route('/new/user/otp').post(isAuthenticatedUser,resendOTP)
router.route('/forgetPassword').post(forgetPassword)
router.route('/resetPassword').post(resetPassword)
export default router;
