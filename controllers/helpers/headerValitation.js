const headerValidation = ({ ...args }) => {
  let result = {
    status: 200,
    sucess: true,
  };

  if (args["content-type"] !== "application/json") {
    result = {
      status: 406,
      sucess: false,

    };
  } else if (args["content-length"] > 5000) {
    result = {
      status: 413,
      sucess: false,
    };
  }

  return result;
};

module.exports = headerValidation;
