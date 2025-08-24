import {
  Product,
  ProductCategory,
  ProductStatus,
} from "@/domain/entities/Product";
import {
  ProductRepository,
  ProductFilters,
} from "@/domain/repositories/ProductRepository";

export interface ListProductsInput {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ListProductsOutput {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(input: ListProductsInput = {}): Promise<ListProductsOutput> {
    const page = Math.max(1, input.page || 1);
    const limit = Math.min(50, Math.max(1, input.limit || 10));

    const filters: ProductFilters = {};

    if (input.category) {
      filters.category = input.category;
    }

    if (input.status) {
      filters.status = input.status;
    }

    if (input.minPrice !== undefined && input.minPrice >= 0) {
      filters.minPrice = input.minPrice;
    }

    if (input.maxPrice !== undefined && input.maxPrice >= 0) {
      filters.maxPrice = input.maxPrice;
    }

    if (input.search && input.search.trim().length > 0) {
      filters.search = input.search.trim();
    }

    const result = await this.productRepository.findAll(page, limit, filters);

    return {
      ...result,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
