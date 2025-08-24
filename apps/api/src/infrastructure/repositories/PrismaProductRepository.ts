import { PrismaClient } from "@prisma/client";
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductCategory,
  ProductStatus,
} from "@/domain/entities/Product";
import {
  ProductRepository,
  ProductFilters,
} from "@/domain/repositories/ProductRepository";

// Interface para o produto do Prisma
interface PrismaProduct {
  id: string;
  name: string;
  description: string;
  category:
    | "PLANTS"
    | "TOOLS"
    | "POTS"
    | "FERTILIZERS"
    | "SEEDS"
    | "ACCESSORIES";
  price: number;
  stock: number;
  sku: string;
  images: string[];
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  weight: number | null;
  height: number | null;
  width: number | null;
  depth: number | null;
  careInstructions: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProductInput): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        stock: data.stock,
        sku: data.sku,
        images: data.images || [],
        weight: data.weight,
        height: data.dimensions?.height,
        width: data.dimensions?.width,
        depth: data.dimensions?.depth,
        careInstructions: data.careInstructions,
      },
    });

    return this.mapPrismaProductToDomain(product as PrismaProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    return product
      ? this.mapPrismaProductToDomain(product as PrismaProduct)
      : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });

    return product
      ? this.mapPrismaProductToDomain(product as PrismaProduct)
      : null;
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: ProductFilters
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};

    if (filters) {
      if (filters.category) {
        where.category = filters.category;
      }
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined) {
          where.price.gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          where.price.lte = filters.maxPrice;
        }
      }
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map(
        (
          product: PrismaProduct // Tipo adicionado aqui
        ) => this.mapPrismaProductToDomain(product)
      ),
      total,
      page,
      limit,
    };
  }

  async findByCategory(
    category: ProductCategory,
    page = 1,
    limit = 10
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.findAll(page, limit, { category });
  }

  async update(id: string, data: UpdateProductInput): Promise<Product | null> {
    try {
      const updateData: any = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.stock !== undefined) updateData.stock = data.stock;
      if (data.images !== undefined) updateData.images = data.images;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.weight !== undefined) updateData.weight = data.weight;
      if (data.careInstructions !== undefined)
        updateData.careInstructions = data.careInstructions;

      if (data.dimensions) {
        if (data.dimensions.height !== undefined)
          updateData.height = data.dimensions.height;
        if (data.dimensions.width !== undefined)
          updateData.width = data.dimensions.width;
        if (data.dimensions.depth !== undefined)
          updateData.depth = data.dimensions.depth;
      }

      const product = await this.prisma.product.update({
        where: { id },
        data: updateData,
      });

      return this.mapPrismaProductToDomain(product as PrismaProduct);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateStock(id: string, quantity: number): Promise<boolean> {
    try {
      await this.prisma.product.update({
        where: { id },
        data: { stock: quantity },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkAvailability(id: string, quantity: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { stock: true, status: true },
    });

    return product?.status === "ACTIVE" && product.stock >= quantity;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: ids },
      },
    });

    return products.map(
      (
        product: PrismaProduct // Tipo adicionado aqui
      ) => this.mapPrismaProductToDomain(product)
    );
  }

  private mapPrismaProductToDomain(prismaProduct: PrismaProduct): Product {
    const dimensions =
      prismaProduct.height || prismaProduct.width || prismaProduct.depth
        ? {
            height: prismaProduct.height || 0,
            width: prismaProduct.width || 0,
            depth: prismaProduct.depth || 0,
          }
        : undefined;

    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description,
      category: prismaProduct.category as ProductCategory,
      price: prismaProduct.price,
      stock: prismaProduct.stock,
      sku: prismaProduct.sku,
      images: prismaProduct.images,
      status: prismaProduct.status as ProductStatus,
      weight: prismaProduct.weight || undefined,
      dimensions,
      careInstructions: prismaProduct.careInstructions || undefined,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
    };
  }
}
