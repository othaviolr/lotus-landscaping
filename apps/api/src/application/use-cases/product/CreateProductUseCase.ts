import { Product, CreateProductInput } from "@/domain/entities/Product";
import { ProductRepository } from "@/domain/repositories/ProductRepository";
import { Money } from "@/domain/value-objects/Money";

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    if (!input.name || input.name.trim().length < 2) {
      throw new Error("Product name must be at least 2 characters long");
    }

    if (!input.description || input.description.trim().length < 10) {
      throw new Error(
        "Product description must be at least 10 characters long"
      );
    }

    if (!input.sku || input.sku.trim().length === 0) {
      throw new Error("Product SKU is required");
    }

    const price = new Money(input.price);
    if (price.getAmount() <= 0) {
      throw new Error("Product price must be greater than zero");
    }

    if (input.stock < 0) {
      throw new Error("Product stock cannot be negative");
    }

    const existingProduct = await this.productRepository.findBySku(input.sku);
    if (existingProduct) {
      throw new Error("Product with this SKU already exists");
    }

    const productData: CreateProductInput = {
      ...input,
      name: input.name.trim(),
      description: input.description.trim(),
      sku: input.sku.trim().toUpperCase(),
      images: input.images || [],
    };

    return await this.productRepository.create(productData);
  }
}
