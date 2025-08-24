import { User, CreateUserInput } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { Email } from "@/domain/value-objects/Email";
import { HashService } from "@/application/services/HashService";

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const email = new Email(input.email);

    const existingUser = await this.userRepository.findByEmail(
      email.getValue()
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    if (input.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const hashedPassword = await this.hashService.hash(input.password);

    const userData: CreateUserInput = {
      ...input,
      email: email.getValue(),
      password: hashedPassword,
      role: input.role || "CUSTOMER",
    };

    return await this.userRepository.create(userData);
  }
}
