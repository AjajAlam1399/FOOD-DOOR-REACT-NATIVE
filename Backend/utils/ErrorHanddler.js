class ErrorHanddler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this,  constructor);
  }
}
export default ErrorHanddler;