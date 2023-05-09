import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
const UserSchemas = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Name Please !"],
    trim: true,
    maxlength: [30, "Name Should not more than 30 chracters"],
    minlength: [4, "Name Should Contain atleast 4 chracters"],
  },
  email: {
    type: String,
    required: [true, "Enter Email please!"],
    unique: true,
    validate: [validator.isEmail, "Enter Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Enter Password Please !"],
    select: false,
    minlength: [8, "Password Should Have Atleast 8 Chracters"],
    maxlength: [20, "Password Should Not Have More Than 20 Chracters"],
  },
  createAt: {
    type: Date,
    default: new Date(Date.now()),
  },
  varified: {
    type: Boolean,
    default: false,
  },
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
    expiresIn:`${process.env.JWT_EXPIRE}`,
  });
};

//compare Password
UserSchemas.methods.comparePassword = async function (inputPassword) {
  return await bcryptjs.compare(inputPassword,this.password);
};

export const User = new mongoose.model("Users", UserSchemas);
