const prisma = require("../../db/db")
const deleteAccount = async (accountId) =>{

  try{
  
    const emailValidator =  await prisma.userValidation.delete({
      where:{
        userId:accountId
      }
     })

    const session =  await prisma.session.delete({
      where:{
        userId:accountId
      }
     })
    const account =  await prisma.user.delete({
      where:{
        id:accountId
      }
     })

     return account
  }
  catch(err){
    throw err
  }

}


module.exports = deleteAccount