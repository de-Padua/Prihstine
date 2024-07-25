const yup = require("yup")


const newUserRequestBodyValidation = async (req, res, next) => {
  try {
    const body = req.body
    const userSchema = yup.object({
      firstName: yup.string().required().max(100, 'names cannot exceed 20 digits'),
      lastName: yup.string().required().max(100, 'names cannot exceed 20 digits'),
      phone: yup.string()
        .matches(/^\d+$/, 'Phone number must be digits only') // Ensure only digits
        .required()
        .max(15, 'Phone number cannot exceed 15 digits'), // Adjust max length as needed
      email: yup.string().email(),
      password: yup.string().min(6).max(90, 'Password cannot exceed 90 digits').required()
    });

    await userSchema.validate(body,  { strict: true },)
    next()

  } catch (err) {
    return res.status(404).json({ data: err.message })

  }

};

module.exports = newUserRequestBodyValidation;
