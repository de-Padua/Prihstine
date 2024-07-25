const yup = require("yup")


const editPostMiddleware = async (req, res, next) => {
  try {
    const body = req.body
    const postSchema = yup.object({
      postTitle: yup.string().max(200).optional(),
      postDescrition: yup.string().max(800).optional(),
      postValue: yup.number().max(200000000000000).optional(),
      address: yup.string().max(100).optional(),
      state: yup.string().max(100).optional(),
      cep: yup.string().max(100).optional(),
      sizeInSquareMeters: yup.string().max(100).optional(),
      isClosed: yup.bool().optional(),

    }).noUnknown(true)

    await postSchema.validate(body,  { strict: true })
    next()

  } catch (err) {
    return res.status(404).json({ data: err.message })

  }
};

module.exports = editPostMiddleware;
