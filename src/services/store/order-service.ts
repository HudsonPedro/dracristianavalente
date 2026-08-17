import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "../../domain/store/order";

import type {
  OrderListFilters,
  OrderRepository,
} from "../../repositories/store/order-repository";

export class OrderService {
  constructor(
    private readonly repository: OrderRepository,
  ) {}

  async list(
    filters?: OrderListFilters,
  ) {
    return this.repository.list(filters);
  }

  async getById(
    id: string,
  ) {
    return this.repository.findById(id);
  }

  async getByOrderNumber(
    orderNumber: string,
  ) {
    return this.repository.findByOrderNumber(
      orderNumber,
    );
  }

  async create(
    order: Order,
  ) {
    this.validateOrder(order);

    return this.repository.create(
      order,
    );
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
  ) {
    return this.repository.updateStatus(
      id,
      status,
    );
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
  ) {
    return this.repository.updatePaymentStatus(
      id,
      paymentStatus,
    );
  }

  private validateOrder(
    order: Order,
  ) {
    if (
      order.items.length === 0
    ) {
      throw new Error(
        "O pedido precisa possuir pelo menos um produto.",
      );
    }

    if (
      !order.customerName.trim()
    ) {
      throw new Error(
        "Nome do cliente é obrigatório.",
      );
    }

    if (
      !order.customerEmail.trim()
    ) {
      throw new Error(
        "E-mail do cliente é obrigatório.",
      );
    }

    if (
      !order.customerPhone.trim()
    ) {
      throw new Error(
        "Telefone do cliente é obrigatório.",
      );
    }

    for (
      const item of order.items
    ) {
      if (
        !Number.isInteger(
          item.quantity,
        ) ||
        item.quantity <= 0
      ) {
        throw new Error(
          `Quantidade inválida para ${item.productName}.`,
        );
      }

      if (item.unitPrice < 0) {
        throw new Error(
          `Preço inválido para ${item.productName}.`,
        );
      }
    }

    const calculatedSubtotal =
      order.items.reduce(
        (total, item) =>
          total +
          item.unitPrice *
            item.quantity,
        0,
      );

    if (
      Math.abs(
        calculatedSubtotal -
          order.subtotal,
      ) > 0.01
    ) {
      throw new Error(
        "Subtotal do pedido inconsistente.",
      );
    }

    const calculatedTotal =
      order.subtotal -
      order.discount +
      order.shipping;

    if (
      Math.abs(
        calculatedTotal -
          order.total,
      ) > 0.01
    ) {
      throw new Error(
        "Total do pedido inconsistente.",
      );
    }
  }
}
