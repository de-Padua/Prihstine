const _db = require("../db/db");
const checkIfSessionIsValid = async (id) => {
  const session =  await _db.session.findUnique({
    where: {
      sessionId: id,
    },
  });
  return session
};


module.exports = checkIfSessionIsValid