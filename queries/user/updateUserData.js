const prisma = require("../../db/db");

const updateUserData = async (userId, newUserData) => {
  try {
    const newUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { ...newUserData },
    });
    return newUser;
  } catch (err) {
    console.error(err)
    return err;
  }
};

module.exports = updateUserData;
