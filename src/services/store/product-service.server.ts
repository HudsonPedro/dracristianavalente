import { DrizzleProductRepository } from "../../repositories/store/drizzle-product-repository.server";
import { ProductService } from "./product-service";

const productRepository =
  new DrizzleProductRepository();

export const productService =
  new ProductService(productRepository);
