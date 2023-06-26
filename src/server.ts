import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import { setupSwagger } from "./config/swagger";

// Load the environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

setupSwagger(app);

// Use the route files
app.use("/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is Express + TypeScript");
});

app.listen(port, () => {
  console.log(`[Server]: I am running at http://localhost:${port}`);
});
