const headerValidation = ({ ...args },res) => {
 
  if (args["content-type"] !== "application/json") {
    return res.status(410).json("invalid content-type")
  }
  

 
};

module.exports = headerValidation;
