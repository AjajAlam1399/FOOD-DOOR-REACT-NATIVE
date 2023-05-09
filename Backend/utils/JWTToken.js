export const SendToken = (user, statusCode, resp) => {
  let token = user.getJWTToken();

  // creating  options
  let options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  const UserData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    varified: user.varified,
  };

  resp.status(statusCode).cookie("token", token, options).json({
    sucess: true,
    UserData,
  });
};
