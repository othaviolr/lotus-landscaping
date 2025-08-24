import {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStatus,
} from "../entities/Order";

export interface OrderFilters {
  userId?: string;
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface OrderRepository {
  create(data: CreateOrderInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(
    page?: number,
    limit?: number,
    filters?: OrderFilters
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }>;
  findByUserId(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(id: string, data: UpdateOrderInput): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  updateStatus(id: string, status: OrderStatus): Promise<boolean>;
}
