require("dotenv").config();

const express = require("express");
const app = express();

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const errorHandler = require("./middlewares/errorHandler");
const validate = require("./middlewares/validate");
const apiKey = require("./middlewares/apiKey");

const { createErrorLogSchema } = require("./validators/errorLog.schema");
const connectDB = require("./config/db");
const ErrorLog = require("./models/ErrorLog");

const CryptoJS = require("crypto-js");
const logger = require("./utils/logger");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const PORT = process.env.PORT || 3000;

/* ================= MIDDLEWARES ================= */

app.use(express.json());
app.use(helmet());

// HTTP logging باستخدام Morgan → Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "TooManyRequests",
    message: "Too many requests, please try again later."
  }
});

app.use(limiter);

/* ================= SWAGGER ================= */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ================= ROUTES ================= */

// Home
app.get("/", (req, res) => {
  res.send("Gumgumji's API is running");
});

// Get Logs
/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get all error logs
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of all error logs
 */

app.get("/logs", apiKey, async (req, res, next) => {
  try {
    const logs = await ErrorLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    next(error);
  }
});

// Metrics
/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Get error statistics
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Error metrics
 */

app.get("/metrics", apiKey, async (req, res, next) => {
  try {
    const totalErrors = await ErrorLog.countDocuments();

    const errorsByLevel = await ErrorLog.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: "$count" }
        }
      }
    ]);

    const topErrors = await ErrorLog
      .find()
      .sort({ count: -1 })
      .limit(5)
      .select("message level count");

    res.json({
      totalErrors,
      errorsByLevel,
      topErrors
    });

  } catch (error) {
    next(error);
  }
});

// Create Log
/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Create a new error log
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       200:
 *         description: Error log created
 */

app.post("/logs", apiKey, validate(createErrorLogSchema), async (req, res, next) => {
  try {
    const { message, level } = req.body;

    const hash = CryptoJS.SHA256(message + level).toString();

    let existingError = await ErrorLog.findOne({ hash });

    if (existingError) {
      existingError.count += 1;
      existingError.lastSeenAt = new Date();
      await existingError.save();

      return res.json({
        message: "Duplicate error detected",
        data: existingError,
      });
    }

    const newError = await ErrorLog.create({
      message,
      level,
      hash,
    });

    res.json(newError);

  } catch (err) {
    next(err);
  }
});

/* ================= ERROR HANDLER ================= */

app.use(errorHandler);

/* ================= START SERVER ================= */

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;