const yup = require("yup")


const newPostValidation = async (req, res, next) => {
  try {
    const postSchema = yup.object({
      postTitle: yup.string().max(200).required(),
      postDescription: yup.string().max(1200).required(), // Fixed typo here
      postValue: yup.number().max(20000000000).required(), // Ensure this matches the Int type in Prisma
      address: yup.object({
        cep: yup.string().required(), // Mark as required if necessary
        logradouro: yup.string().optional(),
        complemento: yup.string().optional(),
        unidade: yup.string().optional(),
        bairro: yup.string().required(),
        localidade: yup.string().optional(),
        uf: yup.string().optional(),
        ibge: yup.string().optional(),
        ddd: yup.string().optional(),
      }),
      sizeInSquareMeters: yup.string().max(100).required(),
     
    });
    await postSchema.validate(req.body,  { strict: true })
    next()

  } catch (err) {
    return res.status(404).json({ data: err.message })

  }

};

module.exports = newPostValidation;
