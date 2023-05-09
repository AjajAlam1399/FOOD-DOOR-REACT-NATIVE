import CatchAsyncError from "./CatchAsyncError.js";
import ErrorHanddler from "../utils/ErrorHanddler.js";
import { User } from "../models/Usermodel.js";

import jsonwebtoken from "jsonwebtoken";

export const isAuthenticatedUser = CatchAsyncError(
  async (reqs, resp, next) => {
    const { token } = reqs.cookies;

    if (!token) {
      return next(
        new ErrorHanddler("Please Sign in to Acess This Resource", 402)
      );
    }
    const verifyToken = await jsonwebtoken.verify(token, process.env.JWT_TOKEN);
    reqs.user = await User.findById(verifyToken.id);
    next();
  }
);
