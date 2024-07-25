const prisma = require("../../db/db")


const deleteUserSession = async (sessionId) => {

  const deleteUserSession = await prisma.session.delete({
    where: {
      sessionId: sessionId
    }
  })


  return deleteUserSession
}


module.exports = deleteUserSession