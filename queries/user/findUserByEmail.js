const prisma = require("../../db/db")


const findUserByEmail = async (email) => {

  const emailExists = await _db.user.findUnique({
    where: { email: email },
  });

  return emailExists
}


module.exports = findUserByEmail