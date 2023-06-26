import * as winston from "winston";
import * as expressWinston from "express-winston";
import * as fs from "fs";
import * as path from "path";
import DailyRotateFile from "winston-daily-rotate-file";

// Create logs directory if it doesn't exist
const logsDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

export const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

// export const logger = winston.createLogger({
//   transports: [
//     new winston.transports.File({ filename: "logs/app.log" }), // Specify the log file path and name
//   ],
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
// });
