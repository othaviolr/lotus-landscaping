import { Request, Response } from "express";
import { CreateProductUseCase } from "@/application/use-cases/product/CreateProductUseCase";
import { ListProductsUseCase } from "@/application/use-cases/product/ListProductsUseCase";
import { ProductRepository } from "@/domain/repositories/ProductRepository";
import { asyncHandler } from "@/presentation/middlewares/errorMiddleware";

export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
    private productRepository: ProductRepository
  ) {}

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = await this.createProductUseCase.execute(req.body);

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  });

  list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.listProductsUseCase.execute(req.query as any);

    res.json({
      message: "Products retrieved successfully",
      data: result,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      message: "Product retrieved successfully",
      data: product,
    });
  });

  getBySku = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { sku } = req.params;

      if (!sku) {
        res.status(400).json({ error: "Product SKU is required" });
        return;
      }

      const product = await this.productRepository.findBySku(sku);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json({
        message: "Product retrieved successfully",
        data: product,
      });
    }
  );

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }

    const product = await this.productRepository.update(id, req.body);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      message: "Product updated successfully",
      data: product,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }

    const success = await this.productRepository.delete(id);

    if (!success) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      message: "Product deleted successfully",
    });
  });

  getByCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await this.productRepository.findByCategory(
        category as any,
        Number(page),
        Number(limit)
      );

      res.json({
        message: "Products retrieved successfully",
        data: {
          ...result,
          totalPages: Math.ceil(result.total / Number(limit)),
        },
      });
    }
  );
}
