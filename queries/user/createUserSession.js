const prisma = require("../../db/db");
const createNewUserSession = async (userId) => {

  const expiresAt = new Date(Date.now() + 3600000);

  try {
    const session = await prisma.session.create({
      where: {
        userId: userId,
      },
      data:{
        expiresAt:expiresAt
      }
    });
 

    return session

  } catch (error) {
    console.error('Error checking session validity:', error);
    return error
  }
};



module.exports = createNewUserSession