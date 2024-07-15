const bodyValidation = (body, model) => {
  const keys = Object.keys(body);
  let error = undefined;

  model.forEach((element) => {
    const currentElement = element;
    if (!keys.includes(currentElement)) {
      error = `invalid request, ${currentElement} field is missing`;
    } else {
    }
  });

  console.log(error);
  return error;
};

module.exports = bodyValidation;
