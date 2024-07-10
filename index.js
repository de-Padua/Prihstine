const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const prisma = require("./db/db");
const cookieParser = require("cookie-parser");
const headerValidation = require("./helpers/headerValitation");
const cors = require("cors");
const port = 5678;

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

// Middleware to attach prisma to the request object
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use(userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
