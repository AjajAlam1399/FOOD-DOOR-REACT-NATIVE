import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
const UserSchemas = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Name Please !"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Enter Email please!"],
    unique: true,
    // validate: [validator.isEmail, "Enter Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Enter Password Please !"],
    select: false,
  },
  createAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  otp: {
    type: Number,
    required: true
  },
  varified: {
    type: Boolean,
    default: false,
  },
  otpExpire: Date,
  resetPasswordOtp: Number,
  resetPasswordOtpExpire: Date
});

// encryption password
UserSchemas.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

// creating a token for sign
UserSchemas.methods.getJWTToken = function () {
  return jsonwebtoken.sign({ id: this._id }, process.env.JWT_TOKEN, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


//compare Password
UserSchemas.methods.comparePassword = async function (inputPassword) {
  return await bcryptjs.compare(inputPassword, this.password);
};


export const User = new mongoose.model("Users", UserSchemas);
