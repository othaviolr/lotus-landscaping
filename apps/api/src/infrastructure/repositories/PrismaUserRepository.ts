import { PrismaClient } from "@prisma/client";
import { User, CreateUserInput, UpdateUserInput } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";

// Interface para o usuário do Prisma
interface PrismaUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role || "CUSTOMER",
      },
    });

    return this.mapPrismaUserToDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapPrismaUserToDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.mapPrismaUserToDomain(user) : null;
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map((user: PrismaUser) => this.mapPrismaUserToDomain(user)),
      total,
      page,
      limit,
    };
  }

  async update(id: string, data: UpdateUserInput): Promise<User | null> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          phone: data.phone,
          isActive: data.isActive,
        },
      });

      return this.mapPrismaUserToDomain(user);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  private mapPrismaUserToDomain(prismaUser: PrismaUser): User {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
      phone: prismaUser.phone ?? undefined,
      role: prismaUser.role,
      isActive: prismaUser.isActive,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }
}
