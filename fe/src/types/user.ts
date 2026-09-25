import { ApiResponse } from './api';

export interface User  {
  emailVerified: boolean;
  isDeleted: boolean;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export type GetAllUsersResponse = ApiResponse<{ users: User[] }>;