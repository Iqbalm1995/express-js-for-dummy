import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import { setupSwagger } from "./config/swagger";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import multer from "multer";

// Load the environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a multer instance and configure its storage
//const upload = multer({ dest: "uploads/" }); // Set the destination folder for uploaded files
// Use the multer middleware for handling form data parsing
//app.use(upload.any());

setupSwagger(app);

// set logger
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(), // Log to console as well
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
  })
);

// Use the route files
app.use("/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is Express + TypeScript");
});

app.listen(port, () => {
  console.log(`[Server]: I am running at http://localhost:${port}`);
});
