import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters long")
    .max(200, "Product name must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Product description must be at least 10 characters long")
    .max(2000, "Product description must be less than 2000 characters"),
  category: z.enum([
    "PLANTS",
    "TOOLS",
    "POTS",
    "FERTILIZERS",
    "SEEDS",
    "ACCESSORIES",
  ]),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(50, "SKU must be less than 50 characters")
    .transform((val) => val.toUpperCase()),
  images: z.array(z.string().url("Invalid image URL")).optional().default([]),
  weight: z.number().min(0, "Weight cannot be negative").optional(),
  dimensions: z
    .object({
      height: z.number().min(0, "Height cannot be negative"),
      width: z.number().min(0, "Width cannot be negative"),
      depth: z.number().min(0, "Depth cannot be negative"),
    })
    .optional(),
  careInstructions: z
    .string()
    .max(1000, "Care instructions must be less than 1000 characters")
    .optional(),
});

export const updateProductSchema = createProductSchema
  .partial()
  .omit({ sku: true });

export const productFiltersSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  category: z
    .enum(["PLANTS", "TOOLS", "POTS", "FERTILIZERS", "SEEDS", "ACCESSORIES"])
    .optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  search: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
