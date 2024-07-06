const _db = require("../db/db");
const checkIfSessionIsValid = (id) => {
  const session = _db.session.findUnique({
    where: {
      userId: id,
    },
  });
  if (session) {
    return true;
  } else {
    return false;
  }
};


module.exports = checkIfSessionIsValid