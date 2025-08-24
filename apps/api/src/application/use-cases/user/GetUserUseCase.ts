import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<Omit<User, "password"> | null> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
