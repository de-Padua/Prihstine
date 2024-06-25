const express = require("express");
const app = express();
const userRoutes = require("./routes/user")
const port = 5678;

app.use(userRoutes)

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
