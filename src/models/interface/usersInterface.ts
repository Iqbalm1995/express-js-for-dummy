export interface GetUsersRequestParams {
  offset?: number;
  limit?: number;
  name?: string;
  sortBy?: "name" | "age";
  sortOrder?: "asc" | "desc";
}

export interface UserRequestUpdate {
  id: number;
  name: string;
  age: number;
  email: string;
  address: string;
}
