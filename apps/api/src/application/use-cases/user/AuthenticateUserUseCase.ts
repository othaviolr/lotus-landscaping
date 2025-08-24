import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { Email } from "@/domain/value-objects/Email";
import { HashService } from "@/application/services/HashService";
import { TokenService } from "@/application/services/TokenService";

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  user: Omit<User, "password">;
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
    private tokenService: TokenService
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const email = new Email(input.email);

    const user = await this.userRepository.findByEmail(email.getValue());
    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("User account is inactive");
    }

    const isPasswordValid = await this.hashService.compare(
      input.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
