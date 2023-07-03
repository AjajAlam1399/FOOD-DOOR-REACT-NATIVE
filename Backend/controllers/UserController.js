import CatchAsyncError from "../middleware/CatchAsyncError.js";
import { User } from "../models/Usermodel.js";
import ErrorHanddler from "../utils/ErrorHanddler.js";
import { SendToken } from "../utils/JWTToken.js";
import {sendRegirsterMail} from '../utils/SendMail.js'

// Register Usser
export const Register = CatchAsyncError(async (reqs, resp, next) => {
  const { name, email, password } = reqs.body;

  if (!name || !email || !password) {
    return next(new ErrorHanddler("Plase Enter All the detail", 400));
  }

  if (name.length < 4 || name.length > 30) {
    return next(new ErrorHanddler("Name should be between 4 to 30 characters", 402));
  }

  if (password.length < 7 || password.length > 20) {
    return next(new ErrorHanddler("password should be between 8 to 20 characters", 402));
  }

  let user = await User.findOne({ email });

  const otp = Math.floor(Math.random() * 10000);

  if (user) {
    if (!user.varified) {
      user.otp = otp;
      await user.save({ validateBeforeSave: false });

      await sendRegirsterMail({
        email,
        subject: "Welcome to Food-Door",
        message: `${otp}  is Your OTP , please cofirm your verification .`,
      });

      SendToken(user, 200, resp);

    }
    else {
      return next(
        new ErrorHanddler("User is Already Exist Please Login ", 400)
      );
    }
  }





  user = await User.create({
    name,
    email,
    password,
    otp,
    otpExpire: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
  });


  await sendRegirsterMail({
    email,
    subject: "Welcome to Food-Door",
    message: `${otp}  is Your OTP , please cofirm your verification .`,
  });

  SendToken(user, 200, resp);
});

//verify users
export const verifyUser = CatchAsyncError(
  async (reqs, resp, next) => {
    const { otp } = reqs.body;
    if (!otp) {
      return next(new ErrorHanddler("Enter otp first", 400));
    }

    const user = await User.findById(reqs.user.id);

    if (otp !== user.otp || user.otpExpire < Date.now()) {
      return next(new ErrorHanddler("opt is Invalid or expire", 401));
    }

    user.varified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save({ validateBeforeSave: false });

    SendToken(user, 200, resp);

  }
)

// get user

export const loadUser = CatchAsyncError(async (reqs, resp, next) => {

  const user = await User.findById(reqs.user.id);
  const { email, name, varified } = user;

  resp.status(200).json({
    sucess: true,
    userData: {
      email, name, varified
    }
  })
})


// Login user
export const login = CatchAsyncError(async (reqs, resp, next) => {
  const { email, password } = reqs.body;

  if (!email || !password) {
    return next(new ErrorHanddler("Please Enter Valid Email or Password", 402));
  }

  const user = await User.findOne({ email }).select("+password");



  if (!user) {
    return next(new ErrorHanddler("Invalid Email or Password", 402));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHanddler("Invalid Email or Password", 402));
  }

  SendToken(user, 200, resp);
});

//Logoout
export const logout = CatchAsyncError(async (reqs, resp, next) => {
  resp.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  resp.status(200).json({
    sucess: true,
    message: "You Have been Sucessfully Logout",
  });
});

// forgetPassword

export const forgetPassword = CatchAsyncError(
  async (reqs, resp, next) => {
    const { email } = reqs.body;
    if (!email) {
      return next(new ErrorHanddler("Please Fill the Email field", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHanddler(`${email} is not registered. Please register`, 401));
    }
  }
)
