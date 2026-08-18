export type StoreSettings = {
  storeEnabled: boolean;

  cartEnabled: boolean;

  checkoutEnabled: boolean;

  paymentEnabled: boolean;

  inventoryEnabled: boolean;

  pickupEnabled: boolean;

  deliveryEnabled: boolean;

  whatsappEnabled: boolean;

  whatsappNumber?: string;

  currency: "BRL";

  minimumOrderValue?: number;

  defaultStockMinimum: number;

  allowSaleWithoutStockControl: boolean;

  requireCustomerIdentification: boolean;
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeEnabled: true,

  cartEnabled: true,

  checkoutEnabled: false,

  paymentEnabled: false,

  inventoryEnabled: true,

  pickupEnabled: false,

  deliveryEnabled: false,

  whatsappEnabled: true,

  whatsappNumber: "5541991599558",

  currency: "BRL",

  defaultStockMinimum: 2,

  allowSaleWithoutStockControl: false,

  requireCustomerIdentification: true,
};
