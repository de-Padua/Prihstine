const prisma = require("../../db/db")


const updateUserSession = async (userToken) => {

  const expiresAt = new Date(Date.now() + 3600000);

  const session = await prisma.session.update({
    where: {
      userId: userToken,
    },
    data: {
      expiresAt:expiresAt
    },
  });
  return session
}


module.exports = updateUserSession