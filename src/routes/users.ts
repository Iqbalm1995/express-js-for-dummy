import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  handleImageUpload,
  updateUser,
} from "../controllers/usersController";
import multer from "multer";
import { logger } from "../config/logger";
import { json } from "sequelize";
import { upload } from "../config/multerConfig";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     parameters:
 *       - name: offset
 *         in: query
 *         description: Number of records to skip for pagination
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Maximum number of records to fetch
 *         schema:
 *           type: integer
 *       - name: name
 *         in: query
 *         description: Filter users by name
 *         schema:
 *           type: string
 *       - name: sortBy
 *         in: query
 *         description: Sort users by name or age
 *         schema:
 *           type: string
 *           enum: [name, age]
 *       - name: sortOrder
 *         in: query
 *         description: Sort order (asc or desc)
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Ok
 *                 data:
 *                   type: array
 */
router.get("/", getUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     description: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - name
 *               - age
 *               - email
 *               - address
 *     responses:
 *       '201':
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Ok
 *                 data:
 *                   type: array
 *       '500':
 *         description: Internal server error
 */
router.post("/", createUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Ok
 *                 data:
 *                   type: array
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update an existing user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteUser);

/**
 * @swagger
 * /users/upload-image:
 *   post:
 *     summary: Upload user image
 *     description: Uploads an image for a user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the user.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload.
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Ok
 *                 data:
 *                   type: array
 */
// router.post("/upload-image", handleImageUpload);
router.post("/upload-image", upload.single("image"), handleImageUpload);

export default router;
