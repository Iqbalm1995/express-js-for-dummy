import { Response } from "express";
import { ApiResponse } from "../models/interface/iResponseData";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  count: number,
  countTotal: number
): void => {
  const response: ApiResponse<T> = {
    statusCode,
    message,
    count,
    countTotal,
    data,
  };

  res.status(statusCode).json(response);
};
