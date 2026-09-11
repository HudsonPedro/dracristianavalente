import type { ProductStatus, StoreProduct } from "../../domain/store/product";

export type ProductListFilters = {
  ids?: string[];

  search?: string;

  status?: ProductStatus;

  saleEnabled?: boolean;

  categoryId?: string;

  featured?: boolean;
};

export interface ProductRepository {
  list(filters?: ProductListFilters): Promise<StoreProduct[]>;

  findById(id: string): Promise<StoreProduct | null>;

  findBySlug(slug: string): Promise<StoreProduct | null>;

  create(product: StoreProduct): Promise<StoreProduct>;

  update(id: string, product: Partial<StoreProduct>): Promise<StoreProduct>;

  delete(id: string): Promise<void>;
}
