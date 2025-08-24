import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductCategory,
  ProductStatus,
} from "../entities/Product";

export interface ProductFilters {
  category?: ProductCategory;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductRepository {
  create(data: CreateProductInput): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(
    page?: number,
    limit?: number,
    filters?: ProductFilters
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }>;
  findByCategory(
    category: ProductCategory,
    page?: number,
    limit?: number
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(id: string, data: UpdateProductInput): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
  updateStock(id: string, quantity: number): Promise<boolean>;
  checkAvailability(id: string, quantity: number): Promise<boolean>;
  findByIds(ids: string[]): Promise<Product[]>;
}
