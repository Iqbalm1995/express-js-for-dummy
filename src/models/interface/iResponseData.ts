export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  count: number;
  countTotal: number;
  data: T;
}
