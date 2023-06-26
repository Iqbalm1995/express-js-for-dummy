import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load the environment variables from .env file
dotenv.config();

const dbDatabase: string = process.env.DB_DATABASE!;
const dbUser: string = process.env.DB_USER!;
const dbPassword: string = process.env.DB_PASSWORD!;
const dbHost: string = process.env.DB_HOST!;
const dbPort: number = parseInt(process.env.DB_PORT!);

// Create a new Sequelize instance
const sequelize = new Sequelize({
  database: dbDatabase,
  username: dbUser,
  password: dbPassword,
  host: dbHost,
  port: dbPort, // Default PostgreSQL port
  dialect: "postgres", // Specify the dialect as 'postgres'
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default sequelize;
