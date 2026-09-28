const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const providerRoutes = require("./routes/providerRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/services", serviceRoutes);


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to ServiceHub API"
    });
});


// Server
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`ServiceHub Server running on port ${PORT}`);
});