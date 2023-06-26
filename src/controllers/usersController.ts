import { Request, Response } from "express";
import dotenv from "dotenv";
import User from "../models/userModel";
import { HttpStatus } from "../constants/constants";
import { GetUsersRequestParams } from "../models/interface/usersInterface";
import { CustomError } from "../errors/CustomError";
import { sendResponse } from "../constants/response";
import { logger } from "../config/logger";
import { json } from "sequelize";
import { BasePagination } from "../config/basePagination";

// GET /users
export const getUsers = async (
  req: Request<{}, {}, {}, GetUsersRequestParams>,
  res: Response
) => {
  logger.info("Executing getUsers"); // log

  const { offset, limit, name, sortBy, sortOrder } = req.query;

  // Create an instance of BasePagination
  const pagination = new BasePagination(offset, limit);

  try {
    let queryOptions: any = {};
    if (name) {
      queryOptions.where = { name };
    }

    if (sortBy && sortOrder) {
      const order = sortOrder === "desc" ? "DESC" : "ASC";
      queryOptions.order = [[sortBy, order]];
    }

    const users = await User.findAll({
      offset: Number(pagination.CalculateOffset()) || 0,
      limit: Number(limit) || 10,
      ...queryOptions,
    });

    const counting = users.length;
    const countResult = await User.count({ ...queryOptions });
    const getCount: number = Array.isArray(countResult)
      ? countResult[0]?.count || 0
      : countResult;

    sendResponse(res, HttpStatus.OK, "Success", users, counting, getCount);
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      logger.warn(json({ statusCode, message })); // log
      res.status(statusCode).json({ statusCode, message });
    } else {
      logger.error("Internal server error"); // log
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

// GET /users/$id
export const getUserById = async (req: Request, res: Response) => {
  logger.info("Executing getUserById"); // log
  const userId = req.params.id; // Assuming the ID is passed as a route parameter

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      //return res.status(404).json({ message: "User not found" });
      throw new CustomError(HttpStatus.NOT_FOUND, "User not found");
    }

    const counting = 1;
    const countTotal = 1;

    sendResponse(res, HttpStatus.OK, "Success", user, counting, countTotal);
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      logger.warn(json({ statusCode, message })); // log
      res.status(statusCode).json({ statusCode, message });
    } else {
      logger.error("Internal server error"); // log
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

// POST /users
export const createUser = async (req: Request, res: Response) => {
  logger.info("Executing createUser"); // log
  const { name, age, email, address } = req.body;

  try {
    const user = await User.create({ name, age, email, address });

    const counting = 1;
    const countTotal = 1;

    sendResponse(
      res,
      HttpStatus.CREATED,
      "Created",
      user,
      counting,
      countTotal
    );
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      logger.warn(json({ statusCode, message })); // log
      res.status(statusCode).json({ statusCode, message });
    } else {
      logger.error("Internal server error"); // log
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

// PUT /users
export const updateUser = async (req: Request, res: Response) => {
  logger.info("Executing updateUser"); // log
  try {
    const { id } = req.params;
    const { name, age, email, address } = req.body;

    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      throw new CustomError(HttpStatus.NOT_FOUND, "User not found");
    }

    // Update the user's attributes
    user.name = name;
    user.age = age;
    user.email = email;
    user.address = address;

    // Save the changes
    await user.save();

    const counting = 1;
    const countTotal = 1;

    sendResponse(res, HttpStatus.OK, "Updated", user, counting, countTotal);
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      logger.warn(json({ statusCode, message })); // log
      res.status(statusCode).json({ statusCode, message });
    } else {
      logger.error("Internal server error"); // log
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

// Delete /users/$id
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  logger.info("Executing deleteUser"); // log
  try {
    const userId: number = parseInt(req.params.id);

    // Delete the user from the database
    const deletedUser = await User.destroy({ where: { id: userId } });

    if (deletedUser === 0) {
      // User not found
      throw new CustomError(HttpStatus.NOT_FOUND, "User not found");
    }

    const counting = 0;
    const countTotal = 0;

    sendResponse(res, HttpStatus.OK, "Deleted", [], counting, countTotal);
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      logger.warn(json({ statusCode, message })); // log
      res.status(statusCode).json({ statusCode, message });
    } else {
      logger.error("Internal server error"); // log
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

export const handleImageUpload = async (req: Request, res: Response) => {
  const userId = req.body.id; // Access the user ID from the request body
  const file = req.file; // Access the uploaded file using req.file

  logger.info(json({ requestFile: file })); // log

  // example req file
  // "requestFile": {
  //   "destination": "uploads/",
  //   "encoding": "7bit",
  //   "fieldname": "image",
  //   "filename": "ab346553825e6acaa2a41ee2f8084100",
  //   "mimetype": "image/png",
  //   "originalname": "bank-bjb-vektor.png",
  //   "path": "uploads\\ab346553825e6acaa2a41ee2f8084100",
  //   "size": 31180
  // }

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      throw new CustomError(
        HttpStatus.NOT_FOUND,
        "User : " + userId + " not found"
      );
    }

    if (!file) {
      throw new CustomError(HttpStatus.NOT_FOUND, "File not found");
    }

    const imagePath = file.path; // Access the path of the uploaded image

    logger.warn(json({ imagePath: imagePath })); // log

    const counting = 0;
    const countTotal = 0;

    sendResponse(
      res,
      HttpStatus.OK,
      "Image Uploaded",
      json({ imagePath: imagePath }),
      counting,
      countTotal
    );
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      logger.warn(json({ statusCode, message })); // log
      res.status(statusCode).json({ statusCode, message });
    } else {
      logger.error("Internal server error"); // log
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

// Other controller functions for updating, deleting, etc.
