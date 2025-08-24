import { prisma } from "@/infrastructure/database/connection";

// Repositories
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { PrismaProductRepository } from "@/infrastructure/repositories/PrismaProductRepository";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";

// Services
import { BcryptHashService } from "@/infrastructure/services/BcryptHashService";
import { JwtTokenService } from "@/infrastructure/services/JwtTokenService";

// Use Cases
import { CreateUserUseCase } from "@/application/use-cases/user/CreateUserUseCase";
import { AuthenticateUserUseCase } from "@/application/use-cases/user/AuthenticateUserUseCase";
import { GetUserUseCase } from "@/application/use-cases/user/GetUserUseCase";
import { CreateProductUseCase } from "@/application/use-cases/product/CreateProductUseCase";
import { ListProductsUseCase } from "@/application/use-cases/product/ListProductsUseCase";

// Controllers
import { AuthController } from "@/presentation/controllers/AuthController";
import { ProductController } from "@/presentation/controllers/ProductController";

// Middlewares
import { AuthMiddleware } from "@/presentation/middlewares/authMiddleware";

export class DIContainer {
  // Repositories
  public readonly userRepository: PrismaUserRepository;
  public readonly productRepository: PrismaProductRepository;
  public readonly orderRepository: PrismaOrderRepository;

  // Services
  public readonly hashService: BcryptHashService;
  public readonly tokenService: JwtTokenService;

  // Use Cases
  public readonly createUserUseCase: CreateUserUseCase;
  public readonly authenticateUserUseCase: AuthenticateUserUseCase;
  public readonly getUserUseCase: GetUserUseCase;
  public readonly createProductUseCase: CreateProductUseCase;
  public readonly listProductsUseCase: ListProductsUseCase;

  // Controllers
  public readonly authController: AuthController;
  public readonly productController: ProductController;

  // Middlewares
  public readonly authMiddleware: AuthMiddleware;

  constructor() {
    // Initialize repositories
    this.userRepository = new PrismaUserRepository(prisma);
    this.productRepository = new PrismaProductRepository(prisma);
    this.orderRepository = new PrismaOrderRepository(prisma);

    // Initialize services
    this.hashService = new BcryptHashService();
    this.tokenService = new JwtTokenService();

    // Initialize use cases
    this.createUserUseCase = new CreateUserUseCase(
      this.userRepository,
      this.hashService
    );

    this.authenticateUserUseCase = new AuthenticateUserUseCase(
      this.userRepository,
      this.hashService,
      this.tokenService
    );

    this.getUserUseCase = new GetUserUseCase(this.userRepository);

    this.createProductUseCase = new CreateProductUseCase(
      this.productRepository
    );

    this.listProductsUseCase = new ListProductsUseCase(this.productRepository);

    // Initialize middlewares
    this.authMiddleware = new AuthMiddleware(this.tokenService);

    // Initialize controllers
    this.authController = new AuthController(
      this.createUserUseCase,
      this.authenticateUserUseCase,
      this.getUserUseCase
    );

    this.productController = new ProductController(
      this.createProductUseCase,
      this.listProductsUseCase,
      this.productRepository
    );
  }
}

// Global container instance
export const container = new DIContainer();
