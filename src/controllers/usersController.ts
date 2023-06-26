import { Request, Response } from "express";
import dotenv from "dotenv";
import User from "../models/userModel";
import { HttpStatus } from "../constants/constants";
import { GetUsersRequestParams } from "../models/interface/usersInterface";
import { CustomError } from "../errors/CustomError";
import { sendResponse } from "../constants/response";

// GET /users
export const getUsers = async (
  req: Request<{}, {}, {}, GetUsersRequestParams>,
  res: Response
) => {
  const { offset, limit, name, sortBy, sortOrder } = req.query;

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
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      ...queryOptions,
    });

    sendResponse(res, HttpStatus.OK, "Success", users);
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      res.status(statusCode).json({ statusCode, message });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

// GET /users/$id
export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id; // Assuming the ID is passed as a route parameter

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      //return res.status(404).json({ message: "User not found" });
      throw new CustomError(HttpStatus.NOT_FOUND, "User not found");
    }

    sendResponse(res, HttpStatus.OK, "Success", user);
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      res.status(statusCode).json({ statusCode, message });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

// POST /users
export const createUser = async (req: Request, res: Response) => {
  const { name, age, email, address } = req.body;

  try {
    const user = await User.create({ name, age, email, address });

    sendResponse(res, HttpStatus.CREATED, "Success Created", user);
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      res.status(statusCode).json({ statusCode, message });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

// PUT /users
export const updateUser = async (req: Request, res: Response) => {
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

    sendResponse(res, HttpStatus.OK, "Success Updated", user);
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      res.status(statusCode).json({ statusCode, message });
    } else {
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
  try {
    const userId: number = parseInt(req.params.id);

    // Delete the user from the database
    const deletedUser = await User.destroy({ where: { id: userId } });

    if (deletedUser === 0) {
      // User not found
      throw new CustomError(HttpStatus.NOT_FOUND, "User not found");
    }

    // User deleted successfully
    sendResponse(res, HttpStatus.OK, "Success Deleted", []);
  } catch (error) {
    console.error("Error :", error);
    if (error instanceof CustomError) {
      const { statusCode, message } = error;
      res.status(statusCode).json({ statusCode, message });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  }
};

// Other controller functions for updating, deleting, etc.
