import { Order, CreateOrderInput, OrderItem } from "@/domain/entities/Order";
import { OrderRepository } from "@/domain/repositories/OrderRepository";
import { ProductRepository } from "@/domain/repositories/ProductRepository";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { Money } from "@/domain/value-objects/Money";

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private userRepository: UserRepository
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("User account is inactive");
    }

    if (!input.items || input.items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    const productIds = input.items.map((item) => item.productId);
    const products = await this.productRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new Error("One or more products not found");
    }

    const orderItems: OrderItem[] = [];
    let subtotal = new Money(0);

    for (const inputItem of input.items) {
      const product = products.find((p) => p.id === inputItem.productId);

      if (!product) {
        throw new Error(`Product ${inputItem.productId} not found`);
      }

      if (product.status !== "ACTIVE") {
        throw new Error(`Product ${product.name} is not available`);
      }

      if (product.stock < inputItem.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${inputItem.quantity}`
        );
      }

      if (inputItem.quantity <= 0) {
        throw new Error("Item quantity must be greater than zero");
      }

      const unitPrice = new Money(product.price);
      const totalPrice = unitPrice.multiply(inputItem.quantity);

      const orderItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        quantity: inputItem.quantity,
        unitPrice: unitPrice.getAmount(),
        totalPrice: totalPrice.getAmount(),
      };

      orderItems.push(orderItem);
      subtotal = subtotal.add(totalPrice);
    }

    const shippingCost = new Money(10);
    const totalAmount = subtotal.add(shippingCost);

    this.validateShippingAddress(input.shippingAddress);

    const orderData = {
      ...input,
      items: orderItems,
      subtotal: subtotal.getAmount(),
      shippingCost: shippingCost.getAmount(),
      totalAmount: totalAmount.getAmount(),
    };

    const order = await this.orderRepository.create(orderData);

    for (const item of input.items) {
      const product = products.find((p) => p.id === item.productId)!;
      await this.productRepository.updateStock(
        product.id,
        product.stock - item.quantity
      );
    }

    return order;
  }

  private validateShippingAddress(address: any): void {
    const requiredFields = [
      "street",
      "number",
      "neighborhood",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    for (const field of requiredFields) {
      if (!address[field] || address[field].toString().trim().length === 0) {
        throw new Error(`Shipping address ${field} is required`);
      }
    }

    const zipCodePattern = /^\d{5}-?\d{3}$/;
    if (!zipCodePattern.test(address.zipCode)) {
      throw new Error("Invalid zip code format");
    }
  }
}
