const app = require("express")

const route = app.Router()

route.get("/",(req,res)=>{
    res.json({data:"asdas"})
})


module.exports = route