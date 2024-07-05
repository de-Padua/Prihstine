const express = require("express");
const app = express();
const getRawBody = require("raw-body");
const contentType = require('content-type');
const userRoutes = require("./routes/user");
const prisma = require("./db/db");
const cookieParser = require('cookie-parser');
const cors = require("cors")
const port = 5678;

app.use(cookieParser());

app.use(userRoutes);
app.use(cors())
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.use((req, res, next) => {
  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return next();
  }
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1kb',
    encoding: contentType.parse(req).parameters.charset || 'utf-8'
  }, (err, string) => {
    if (err) return next(err);
    req.text = string;
    next();
  });
});

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});



