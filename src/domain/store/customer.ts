export type CustomerStatus = "ACTIVE" | "INACTIVE";

export type Customer = {
  id: string;

  name: string;

  email: string;

  phone: string;

  cpf?: string;

  status: CustomerStatus;

  createdAt?: string;
  updatedAt?: string;
};

export type CustomerAddress = {
  id: string;

  customerId?: string;

  label?: string;

  recipientName: string;

  postalCode: string;

  street: string;

  number: string;

  complement?: string;

  neighborhood: string;

  city: string;

  state: string;

  country: string;

  isDefault: boolean;
};
