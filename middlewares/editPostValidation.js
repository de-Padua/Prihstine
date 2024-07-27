const yup = require("yup")


const editPostMiddleware = async (req, res, next) => {
  try {
    const body = req.body
    const postSchema = yup.object({
      postTitle: yup.string().max(200).optional(),
      postDescription: yup.string().max(1200).optional(), // Fixed typo here
      postValue: yup.number().max(20000000000).optional(), // Ensure this matches the Int type in Prisma
      address: yup.object({
        cep: yup.string().optional(), // Mark as optional if necessary
        logradouro: yup.string().optional(),
        complemento: yup.string().optional(),
        unidade: yup.string().optional(),
        bairro: yup.string().optional(),
        localidade: yup.string().optional(),
        uf: yup.string().optional(),
        ibge: yup.string().optional(),
        ddd: yup.string().optional(),
      }),
      sizeInSquareMeters: yup.string().max(100).optional(),
     
    }).noUnknown(true)

    await postSchema.validate(body,  { strict: true })
    next()

  } catch (err) {
    return res.status(404).json({ data: err.message })

  }
};

module.exports = editPostMiddleware;
