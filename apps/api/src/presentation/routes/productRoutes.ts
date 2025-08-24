import { Router } from "express";
import { ProductController } from "@/presentation/controllers/ProductController";
import {
  validateRequest,
  validateQuery,
} from "@/presentation/middlewares/validationMiddleware";
import { AuthMiddleware } from "@/presentation/middlewares/authMiddleware";
import {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
} from "@/shared/validators/productValidators";

export function createProductRoutes(
  productController: ProductController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  /**
   * @route GET /api/products
   * @desc Get all products with filters
   * @access Public
   */
  router.get("/", validateQuery(productFiltersSchema), productController.list);

  /**
   * @route GET /api/products/category/:category
   * @desc Get products by category
   * @access Public
   */
  router.get("/category/:category", productController.getByCategory);

  /**
   * @route GET /api/products/:id
   * @desc Get product by ID
   * @access Public
   */
  router.get("/:id", productController.getById);

  /**
   * @route GET /api/products/sku/:sku
   * @desc Get product by SKU
   * @access Public
   */
  router.get("/sku/:sku", productController.getBySku);

  /**
   * @route POST /api/products
   * @desc Create a new product
   * @access Private (Admin only)
   */
  router.post(
    "/",
    authMiddleware.authenticate,
    authMiddleware.requireRole("ADMIN"),
    validateRequest(createProductSchema),
    productController.create
  );

  /**
   * @route PUT /api/products/:id
   * @desc Update product
   * @access Private (Admin only)
   */
  router.put(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.requireRole("ADMIN"),
    validateRequest(updateProductSchema),
    productController.update
  );

  /**
   * @route DELETE /api/products/:id
   * @desc Delete product
   * @access Private (Admin only)
   */
  router.delete(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.requireRole("ADMIN"),
    productController.delete
  );

  return router;
}
