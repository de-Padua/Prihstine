const _db = require("../db/db")
const deleteAccount = async (accountId) =>{

  try{
  
    const emailValidator =  await _db.userValidation.delete({
      where:{
        userId:accountId
      }
     })

    const session =  await _db.session.delete({
      where:{
        userId:accountId
      }
     })
    const account =  await _db.user.delete({
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