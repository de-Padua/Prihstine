const Sequelize = require("sequelize")
const db = require("../db/db")



const User = db.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    firstName:{
        type:Sequelize.STRING(30),
        allowNull:false
    },
    lastName:{
        type:Sequelize.STRING(30),
        allowNull:false
    },
    age:{
        type:Sequelize.INTEGER,
        allowNull:false
    },


})


module.exports = User