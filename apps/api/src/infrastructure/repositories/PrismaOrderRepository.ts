import { PrismaClient } from "@prisma/client";
import {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStatus,
  OrderItem,
  ShippingAddress,
} from "@/domain/entities/Order";
import {
  OrderRepository,
  OrderFilters,
} from "@/domain/repositories/OrderRepository";

// Interfaces para os tipos do Prisma
interface PrismaOrder {
  id: string;
  userId: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  trackingCode: string | null;
  notes: string | null;
  shippingStreet: string;
  shippingNumber: string;
  shippingComplement: string | null;
  shippingNeighborhood: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

type PrismaOrderWithItems = PrismaOrder & {
  items: PrismaOrderItem[];
};

export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateOrderInput): Promise<Order> {
    const order = await this.prisma.order.create({
      data: {
        userId: data.userId,
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        totalAmount: data.totalAmount,
        shippingStreet: data.shippingAddress.street,
        shippingNumber: data.shippingAddress.number,
        shippingComplement: data.shippingAddress.complement,
        shippingNeighborhood: data.shippingAddress.neighborhood,
        shippingCity: data.shippingAddress.city,
        shippingState: data.shippingAddress.state,
        shippingZipCode: data.shippingAddress.zipCode,
        shippingCountry: data.shippingAddress.country,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.mapPrismaOrderToDomain(order as PrismaOrderWithItems);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    return order
      ? this.mapPrismaOrderToDomain(order as PrismaOrderWithItems)
      : null;
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: OrderFilters
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};

    if (filters) {
      if (filters.userId) {
        where.userId = filters.userId;
      }
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) {
          where.createdAt.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          where.createdAt.lte = filters.dateTo;
        }
      }
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: orders.map(
        (
          order: PrismaOrderWithItems // Tipo adicionado aqui
        ) => this.mapPrismaOrderToDomain(order)
      ),
      total,
      page,
      limit,
    };
  }

  async findByUserId(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.findAll(page, limit, { userId });
  }

  async update(id: string, data: UpdateOrderInput): Promise<Order | null> {
    try {
      const updateData: any = {};

      if (data.status !== undefined) updateData.status = data.status;
      if (data.paymentStatus !== undefined)
        updateData.paymentStatus = data.paymentStatus;
      if (data.trackingCode !== undefined)
        updateData.trackingCode = data.trackingCode;
      if (data.notes !== undefined) updateData.notes = data.notes;

      const order = await this.prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          items: true,
        },
      });

      return this.mapPrismaOrderToDomain(order as PrismaOrderWithItems);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.order.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<boolean> {
    try {
      await this.prisma.order.update({
        where: { id },
        data: { status },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapPrismaOrderToDomain(prismaOrder: PrismaOrderWithItems): Order {
    const shippingAddress: ShippingAddress = {
      street: prismaOrder.shippingStreet,
      number: prismaOrder.shippingNumber,
      complement: prismaOrder.shippingComplement || undefined,
      neighborhood: prismaOrder.shippingNeighborhood,
      city: prismaOrder.shippingCity,
      state: prismaOrder.shippingState,
      zipCode: prismaOrder.shippingZipCode,
      country: prismaOrder.shippingCountry,
    };

    const items: OrderItem[] = prismaOrder.items.map(
      (item: PrismaOrderItem) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })
    );

    return {
      id: prismaOrder.id,
      userId: prismaOrder.userId,
      items,
      subtotal: prismaOrder.subtotal,
      shippingCost: prismaOrder.shippingCost,
      totalAmount: prismaOrder.totalAmount,
      status: prismaOrder.status as OrderStatus,
      paymentStatus: prismaOrder.paymentStatus as
        | "PENDING"
        | "PAID"
        | "FAILED"
        | "REFUNDED",
      shippingAddress,
      trackingCode: prismaOrder.trackingCode || undefined,
      notes: prismaOrder.notes || undefined,
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,
    };
  }
}
