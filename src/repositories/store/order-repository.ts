import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "../../domain/store/order";

export type OrderListFilters = {
  customerId?: string;

  status?: OrderStatus;

  paymentStatus?: PaymentStatus;
};

export interface OrderRepository {
  list(
    filters?: OrderListFilters,
  ): Promise<Order[]>;

  findById(
    id: string,
  ): Promise<Order | null>;

  findByOrderNumber(
    orderNumber: string,
  ): Promise<Order | null>;

  create(
    order: Order,
  ): Promise<Order>;

  update(
    id: string,
    order: Partial<Order>,
  ): Promise<Order>;

  updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order>;

  updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
  ): Promise<Order>;
}
