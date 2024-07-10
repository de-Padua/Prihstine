const headerValidation = ({ ...args },res) => {
 
  if (args["content-type"] !== "application/json") {
    return res.json("invalid content-type").status(410)
  }
  

 
};

module.exports = headerValidation;
