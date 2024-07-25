
const headerValidationMiddleware =  (req,res,next) => {
  if (req.method !== "POST") {
    return next();
  }
  if (req.headers["content-type"] !== "application/json") {
    return res.status(410).json("invalid content-type")
  }
  next();
}


module.exports = headerValidationMiddleware