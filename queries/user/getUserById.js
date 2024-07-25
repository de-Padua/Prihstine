const prisma = require("../../db/db");
const getUserById = async (id) => {
  const user =  await prisma.user.findUnique({
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