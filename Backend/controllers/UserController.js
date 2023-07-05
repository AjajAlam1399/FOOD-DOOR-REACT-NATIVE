import CatchAsyncError from "../middleware/CatchAsyncError.js";
import { User } from "../models/Usermodel.js";
import ErrorHanddler from "../utils/ErrorHanddler.js";
import { SendToken } from "../utils/JWTToken.js";
import { sendRegirsterMail } from '../utils/SendMail.js'

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
      user.name = name;
      user.password = password;
      user.otpExpire = new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000)
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

// resendOtp
export const resendOTP = CatchAsyncError(
  async (reqs, resp, next) => {

    const user = await User.findById(reqs.user.id);

    if (!user) {
      return next(new ErrorHanddler("user not Exist please SignUp again .", 402));
    }

    const otp = Math.floor(Math.random() * 10000);
    let email = user.email;
    user.otp = otp;
    await user.save({ validateBeforeSave: false });

    await sendRegirsterMail({
      email,
      subject: "Welcome to Food-Door",
      message: `${otp}  is Your OTP , please cofirm your verification .`,
    });

    resp.status(200).json({
      sucess: true,
      message: `OTP has been sucessfully sent to email ${email}`
    })

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

  if (!user.varified) {
    return next(new ErrorHanddler("Your account has not been verified , Please SignUp again .", 402))
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

    const otp = Math.ceil(Math.random() * 100000);
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000)

    await user.save({ validateBeforeSave: false });

    await sendRegirsterMail({
      email,
      subject: "Reset Password Food-Door",
      message: `${otp}  is Your OTP , please cofirm your verification for password change .`,
    });

    resp.status(200).json({
      sucess: true,
      message: `Reset Password OTP has been sucessfully sent on email ${email}`
    })
  }
)

export const resetPassword = CatchAsyncError(
  async (reqs, resp, next) => {
    const { otp, newPassword, confirmPassword, email } = reqs.body;
    if (!otp || !newPassword || !confirmPassword || !email) {
      return next(new ErrorHanddler("Please Enter all the field", 400));
    }

    const user = await User.findOne({ email});

    if (otp !== user.resetPasswordOtp || user.resetPasswordOtpExpire< Date.now()) {
      return next(new ErrorHanddler("opt is Invalid or expire", 401));
    }

    if(confirmPassword!==newPassword){
      return next(new ErrorHanddler("new password and confirm password doesnot match", 401));
    }

    if(newPassword.length<4 || newPassword.length>20){
      return next(new ErrorHanddler("password length should between 4-20 characters", 401));
    }
    
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpire = null;
    user.password=newPassword;
    await user.save({ validateBeforeSave: false });

    resp.status(200).json({
      sucess:true,
      message:'Password has been sucessfully changed'
    })

  }
)
