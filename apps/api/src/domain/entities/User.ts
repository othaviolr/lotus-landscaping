export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "CUSTOMER" | "ADMIN";
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  isActive?: boolean;
}
