const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const prisma = require("./db/db");
const cookieParser = require("cookie-parser");
const headerValidation = require("./helpers/headerValitation");
const { createClient } = require("redis");
const cors = require("cors");

const port = 5678;
const client = createClient({ url: 'redis://redis:6379' });

app.set("trust proxy", true);
app.set("view engine", "ejs");
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "1kb" })); // Adjusted limit to 1MB
app.use((req, res, next) => {
  if (req.method !== "POST") {
    return next();
  }
  headerValidation(req.headers, res);
  next();
});

//redis

app.use((req, res, next) => {

  const requestLimit = 7

  const url = req.originalUrl;
  const ip = req.ip;
  const key = `resource:${url}:userIP:${ip}`;

  const main = async () => {
    const requestCount = Number(await client.get(key) || 0)  + 1;
    
    if(requestCount <= requestLimit - 1){
      await client.set(key,requestCount,{EX:40})
       next()
    }  
    else{
      res.status(429).end()
    }
  };
  main();
});

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use(userRoutes);

const startup = async () => {

  await client.connect();

  app.listen(port, () => {
    //dev mode
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startup()