const ErrorMiddleware= (err, reqs, resp, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal Server Error";
  
    resp.status(err.statusCode).json({
      sucess: false,
      error: err.message,
    });
  };
  
  export default ErrorMiddleware;