const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
const suitecrmRoutes = require("./routes/suitecrm.routes");
const platformRoutes = require("./routes/platform.routes");

app.use("/api/v1/suitecrm", suitecrmRoutes);
app.use("/api/v1/platform", platformRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Middleware listening on port ${PORT}`);
});
