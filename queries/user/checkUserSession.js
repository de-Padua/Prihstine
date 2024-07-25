const prisma = require("../../db/db");
const checkIfSessionIsValid = async (id) => {
  try {
    const session = await prisma.session.findUnique({
      where: {
        sessionId: id,
      },
    });

    if (!session) {
      console.log("session is invalid")
      return undefined; // Session not found
    }

    const currentTime = Date.now();
    const expirationTime = new Date(session.expiresAt).getTime();

    if (currentTime > expirationTime) {
      console.log(" Session has expired")

      return undefined; // Session has expired
    }
    console.log(" // Session is still valid")

    return session; // Session is still valid



  } catch (error) {
    console.error('Error checking session validity:', error);
    return false; // Handle the error appropriately
  }
};



module.exports = checkIfSessionIsValid