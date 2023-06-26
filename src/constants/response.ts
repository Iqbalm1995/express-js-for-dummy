import { Response } from "express";
import { ApiResponse } from "../models/interface/iResponseData";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T
): void => {
  const response: ApiResponse<T> = {
    statusCode,
    message,
    data,
  };

  res.status(statusCode).json(response);
};
