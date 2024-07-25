const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const prisma = require("./db/db");
const cookieParser = require("cookie-parser");
const { createClient } = require("redis");
const cors = require("cors");
const postRoute = require("./routes/post");
const rateLimiteMiddleware = require("./middlewares/rateLimitMiddleware");
const headerValidationMiddleware = require("./middlewares/headerValidationMiddleware");




const client = createClient({ url: "redis://redis:6379" });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use((req, res, next) => headerValidationMiddleware(req,res,next) );

app.use(async (req, res, next) => {
 return rateLimiteMiddleware(client,req,res,next)
});

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});


app.set("trust proxy", true);
app.set("view engine", "ejs");


app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "1kb" })); // Adjusted limit to 1MB

app.use(userRoutes);
app.use(postRoute);





const port = 5678;
const startup = async () => {
  await client.connect();

  app.listen(port, () => {
    //dev mode
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startup();
