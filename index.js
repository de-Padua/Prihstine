const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const prisma = require("./db/db");
const cookieParser = require("cookie-parser");
const headerValidation = require("./helpers/headerValitation");
const { createClient } = require("redis");
const cors = require("cors");
const { compare } = require("bcryptjs");
const postRoute = require("./routes/post")

const port = 5678;
const client = createClient({ url: "redis://redis:6379" });

const requestLimit = 7;
const expirationTime = 40; // seconds

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

app.use(async (req, res, next) => {
  try {
    const url = req.originalUrl;
    const ip = req.ip;
    const key = `resource:${url}:userIP:${ip}`;

    const requestCount = Number((await client.get(key)) || 0) + 1;

    if (requestCount <= requestLimit - 1) {
      await client.set(key, requestCount, { EX: expirationTime });
      next();
    } else {
      res.status(429).end();
    }
  } catch (error) {
    res.status(500).json(error).end();
  }
});

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use(userRoutes);
app.use(postRoute);

const startup = async () => {
  await client.connect();

  app.listen(port, () => {
    //dev mode
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startup();
