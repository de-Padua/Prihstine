const yup = require("yup")


const changePasswordValidation = async (req, res, next) => {
  try {
    const body = req.body
    const passwordSchema = yup.object({
      password: yup.string().min(6).max(90, 'Password cannot exceed 90 digits').required()
    });

    await passwordSchema.validate(body, { strict: true },)
    next()

  } catch (err) {
    return res.status(404).json({ data: err.message })

  }

};

module.exports = changePasswordValidation;
