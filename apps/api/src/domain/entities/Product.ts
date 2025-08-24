export type ProductCategory =
  | "PLANTS"
  | "TOOLS"
  | "POTS"
  | "FERTILIZERS"
  | "SEEDS"
  | "ACCESSORIES";
export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  sku: string;
  images: string[];
  status: ProductStatus;
  weight?: number;
  dimensions?: {
    height: number;
    width: number;
    depth: number;
  };
  careInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  sku: string;
  images?: string[];
  weight?: number;
  dimensions?: {
    height: number;
    width: number;
    depth: number;
  };
  careInstructions?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  category?: ProductCategory;
  price?: number;
  stock?: number;
  images?: string[];
  status?: ProductStatus;
  weight?: number;
  dimensions?: {
    height: number;
    width: number;
    depth: number;
  };
  careInstructions?: string;
}
