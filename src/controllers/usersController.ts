import { Request, Response } from "express";
import dotenv from "dotenv";
import User from "../models/userModel";
import { HttpStatus } from "../constants/constants";
import { ApiResponse } from "../models/interface/iResponseData";
import {
  GetUsersRequestParams,
  UserRequestUpdate,
} from "../models/interface/usersInterface";

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

    const response: ApiResponse<User[]> = {
      statusCode: HttpStatus.OK,
      message: "Ok",
      data: users,
    };

    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    console.error("Error retrieving users:", error);
    const response: ApiResponse<User[]> = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      data: [],
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
  }
};

// GET /users/$id
export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id; // Assuming the ID is passed as a route parameter

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const response: ApiResponse<User> = {
      statusCode: HttpStatus.OK,
      message: "Ok",
      data: user,
    };

    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    console.error("Error retrieving users:", error);
    const response: ApiResponse<User[]> = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      data: [],
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
  }
};

// POST /users
export const createUser = async (req: Request, res: Response) => {
  const { name, age, email, address } = req.body;

  try {
    const user = await User.create({ name, age, email, address });
    const response: ApiResponse<User> = {
      statusCode: HttpStatus.CREATED,
      message: "Created",
      data: user,
    };
    res.status(HttpStatus.CREATED).json(response);
  } catch (error) {
    console.error("Error creating user:", error);
    const response: ApiResponse<User[]> = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      data: [],
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
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
      const response: ApiResponse<User[]> = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "User not found",
        data: [],
      };
      return res.status(HttpStatus.NOT_FOUND).json(response);
    }

    // Update the user's attributes
    user.name = name;
    user.age = age;
    user.email = email;
    user.address = address;

    // Save the changes
    await user.save();
    const response: ApiResponse<User> = {
      statusCode: HttpStatus.OK,
      message: "Updated",
      data: user,
    };
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    console.error("Error updating user:", error);
    const response: ApiResponse<User[]> = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      data: [],
    };
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
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
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    } else {
      // User deleted successfully
      res.json({
        statusCode: HttpStatus.OK,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    });
  }
};

// Other controller functions for updating, deleting, etc.
