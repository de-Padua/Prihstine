
const express = require("express")
const app = express()
const cors = require("cors")

//routes
const home_route = require("./routes/home")


//port
const port = 5678

//server config
app.use(cors());
app.use(home_route)

//csp
app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src *; font-src *",
    });
    next();
});

app.listen(port,(err)=>{
    if(err) throw err
    
    console.log(`server is runing on http://localhost:${port}`)
})