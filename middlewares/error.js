const error = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
  
  
    if (process.env.NODE_ENV === "development") {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack: err.stack,
      });
    } else if (process.env.NODE_ENV === "production") {
      let message = err.message;
      let error = err;
  
  
      if (err.name === "ValidationError") {
        message = Object.values(err.errors).map((value) => value.message);
        error = new Error(message);
        error.statusCode = 400;
      } else if (err.name === "CastError") {
        message = `Resource not found: ${err.path}`;
        error = new Error(message); 
        error.statusCode = 400;
      } else if (err.code === 11000) {
        message = `Duplicate key error: ${Object.keys(err.keyValue)}`;
        error = new Error(message);
        error.statusCode = 400;
      } else if (err.name === "JSONWebTokenError") {
        message = "Token invalid";
        error = new Error(message);
        error.statusCode = 400;
      }
  
      res.status(error.statusCode).json({
        success: false,
        message: message || "Internal server error",
      });
    }
  };
  
  export default error;