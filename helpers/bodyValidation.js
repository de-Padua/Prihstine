const bodyValidation = (body, model) => {
  const keys = Object.keys(body);

  let error;
  keys.forEach((element) => {
    if (!model.includes(element)) {
      error = `invalid request,${element} field is missing`;
    }
  });
  return error;
};

module.exports = bodyValidation;
