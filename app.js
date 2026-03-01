require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const syncRouter = require("./routes/sync");
const apiRouter = require("./routes/api");
const dashboardRouter = require("./routes/dashboard");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Seguridad + logs
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static
app.use("/public", express.static("public"));

// View engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Routes
app.use(syncRouter);          
app.use("/api", apiRouter);   
app.use(dashboardRouter);     

// Error handling centralizado
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});