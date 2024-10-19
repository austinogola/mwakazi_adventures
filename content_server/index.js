const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const invoiceRoutes = require("./routes/invoices");
const tripRoutes = require("./routes/trips");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const activitiesRoutes = require("./routes/activities");
const accommodationsRoutes = require("./routes/accommodations");

const dotenv = require("dotenv");

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.mwakaziadventures.com",
  "https://mwakaziadventures.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Ensure PATCH is included
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Define routes
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/activities", activitiesRoutes);
app.use("/api/v1/accommodations", accommodationsRoutes);
app.use("/auth", authRoutes);

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Start server
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
