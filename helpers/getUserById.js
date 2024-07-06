const _db = require("../db/db");
const getUserById = (id) => {
  const user = _db.user.findUnique({
    where: {
      id: id,
    },
    include:{
      posts:true
    }
  });
  if (user) {
    return user;
  } else {
    return undefined;
  }
};


module.exports = getUserById