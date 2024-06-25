const express = require("express");
const app = express();

const port = 5678;

// Define a route handler for the root endpoint "/"
app.get("/", (req, res) => {
    res.json({ data: "oi" }); // Return JSON response
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
