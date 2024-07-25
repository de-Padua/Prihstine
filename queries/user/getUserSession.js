const prisma = require("../../db/db")


const getUserSession = async (userToken) => {

  const findUserSession = await prisma.session.findFirst({
    where: {
      sessionId: userToken
    }
  })


  return findUserSession
}


module.exports = getUserSession