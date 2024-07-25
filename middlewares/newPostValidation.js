const yup = require("yup")


const newPostValidation = async (req, res, next) => {
  try {
    const body = req.body
    const postSchema = yup.object({
      postTitle: yup.string().max(200).required(),
      postDescrition: yup.string().max(800).required(),
      postValue: yup.number().max(200).required(),
      address: yup.string().max(100).required(),
      state: yup.string().max(100).required(),
      cep: yup.string().max(100).required(),
      sizeInSquareMeters: yup.string().max(100).required(),
      isClosed: yup.bool().required(),

    });

    await postSchema.validate(body,  { strict: true })
    next()

  } catch (err) {
    return res.status(404).json({ data: err.message })

  }

};

module.exports = newPostValidation;
