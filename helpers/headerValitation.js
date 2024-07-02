const headerValidation = ({ ...args }) => {
  let result = {
    status: 200,
    sucess: true,
    type:undefined
  };

  if (args["content-type"] !== "application/json") {
    result = {
      status: 406,
      sucess: false,
      type:"content-type unsuported"
    };
  } else if (args["content-length"] > 5000) {
    result = {
      status: 413,
      sucess: false,
      type:"content-type too long"

    };
  }

  return result;
};

module.exports = headerValidation;
