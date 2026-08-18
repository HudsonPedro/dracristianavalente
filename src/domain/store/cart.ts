export type StoreCartItem = {
  productId: string;

  quantity: number;

  unitPrice: number;

  addedAt: string;
};

export type StoreCart = {
  id: string;

  customerId?: string;

  items: StoreCartItem[];

  createdAt: string;
  updatedAt: string;
};

export type CartTotals = {
  itemCount: number;

  subtotal: number;

  discount: number;

  shipping: number;

  total: number;
};

export function calculateCartTotals(cart: StoreCart, discount = 0, shipping = 0): CartTotals {
  const subtotal = cart.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  const safeDiscount = Math.max(0, discount);

  const safeShipping = Math.max(0, shipping);

  const total = Math.max(0, subtotal - safeDiscount + safeShipping);

  return {
    itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),

    subtotal,
    discount: safeDiscount,
    shipping: safeShipping,
    total,
  };
}
