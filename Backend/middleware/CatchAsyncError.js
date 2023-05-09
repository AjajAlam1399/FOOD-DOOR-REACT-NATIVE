const CatchAsyncError= (thefun) => (reqs, resp, next) => {
    Promise.resolve(thefun(reqs, resp, next)).catch(next);
  };
  export default CatchAsyncError;