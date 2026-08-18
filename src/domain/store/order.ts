export type OrderStatus =
  | "PENDING"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "READY"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";

export type FulfillmentType = "DELIVERY" | "PICKUP";

export type OrderItem = {
  id: string;

  productId: string;

  productName: string;

  quantity: number;

  unitPrice: number;

  total: number;
};

export type OrderAddress = {
  recipientName: string;

  postalCode: string;

  street: string;

  number: string;

  complement?: string;

  neighborhood: string;

  city: string;

  state: string;

  country: string;
};

export type Order = {
  id: string;

  orderNumber: string;

  customerId?: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  items: OrderItem[];

  subtotal: number;
  discount: number;
  shipping: number;
  total: number;

  fulfillmentType: FulfillmentType;

  deliveryAddress?: OrderAddress;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  notes?: string;

  createdAt: string;
  updatedAt: string;
};
