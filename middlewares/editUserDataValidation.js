const yup = require("yup");

const editUserDataValidation = async (req, res, next) => {
  try {
    const body = req.body;
    const userBodySchema = yup
      .object({
        password: yup.string().max(200).optional(),
        firstName: yup.string().max(100).optional(),
        phone: yup.number().max(20).optional(),
        lastName: yup.string().max(100).optional(),
      })
      .noUnknown(true);

    await userBodySchema.validate(body, { strict: true });
    next();
  } catch (err) {
    return res.status(404).json({ data: err.message });
  }
};

module.exports = editUserDataValidation;
