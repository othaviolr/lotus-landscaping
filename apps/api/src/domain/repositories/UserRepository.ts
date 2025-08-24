import { User, CreateUserInput, UpdateUserInput } from "../entities/User";

export interface UserRepository {
  create(data: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(
    page?: number,
    limit?: number
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(id: string, data: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  exists(email: string): Promise<boolean>;
}
