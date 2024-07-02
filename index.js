const express = require("express");
const app = express();
const userRoutes = require("./routes/user")
const prisma = require("./db/db")
const port = 5678;


app.use(userRoutes)

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

