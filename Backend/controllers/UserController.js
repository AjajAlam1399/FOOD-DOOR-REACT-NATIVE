import CatchAsyncError from "../middleware/CatchAsyncError.js";
import { User } from "../models/Usermodel.js";
import ErrorHanddler from "../utils/ErrorHanddler.js";
import { SendToken } from "../utils/JWTToken.js";

// Register Usser
export const Register = CatchAsyncError(async (reqs, resp, next) => {
  const { name, email, password } = reqs.body;

  if (!name || !email || !password) {
    return next(new ErrorHanddler("Plase Enter All the detail", 400));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(
      new ErrorHanddler("User is Already Exist Please Login ", 400)
    );
  }

  user = await User.create({
    name,
    email,
    password,
  });
  SendToken(user, 200, resp);
});

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
