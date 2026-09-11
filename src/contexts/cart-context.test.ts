import { describe, expect, it, vi } from "vitest";

vi.mock("../functions/public-store-products", () => ({
  getPublicStoreProductsByIds: vi.fn(),
}));

import {
  canProductBeAddedToCart,
  getProductSalePrice,
} from "./cart-context";

function eligibleProduct() {
  return {
    saleEnabled: true,
    priceVisibility: "SHOW_PRICE" as const,
    price: 100,
    promotionalPrice: undefined,
    requiresEvaluation: false,
    requiresProtocol: false,
    availability: "AVAILABLE" as const,
  };
}

describe("canProductBeAddedToCart", () => {
  it("allows a product that satisfies every direct-sale requirement", () => {
    expect(canProductBeAddedToCart(eligibleProduct())).toEqual({
      success: true,
    });
  });

  it("rejects a product not enabled for online sale", () => {
    expect(
      canProductBeAddedToCart({
        ...eligibleProduct(),
        saleEnabled: false,
      }).success,
    ).toBe(false);
  });

  it("rejects a product that requires professional evaluation", () => {
    expect(
      canProductBeAddedToCart({
        ...eligibleProduct(),
        requiresEvaluation: true,
      }).success,
    ).toBe(false);
  });

  it("rejects a product linked to a professional protocol", () => {
    expect(
      canProductBeAddedToCart({
        ...eligibleProduct(),
        requiresProtocol: true,
      }).success,
    ).toBe(false);
  });

  it("rejects a product whose price is not publicly visible", () => {
    expect(
      canProductBeAddedToCart({
        ...eligibleProduct(),
        priceVisibility: "HIDE_PRICE",
      }).success,
    ).toBe(false);
  });

  it("rejects a product without a configured numeric sale price", () => {
    expect(
      canProductBeAddedToCart({
        ...eligibleProduct(),
        price: undefined,
      }).success,
    ).toBe(false);
  });

  it("rejects a product that is not currently available", () => {
    expect(
      canProductBeAddedToCart({
        ...eligibleProduct(),
        availability: "UNAVAILABLE",
      }).success,
    ).toBe(false);
  });
});

describe("getProductSalePrice", () => {
  it("uses promotional price when configured", () => {
    expect(
      getProductSalePrice({
        price: 100,
        promotionalPrice: 79.9,
      }),
    ).toBe(79.9);
  });

  it("uses regular price when promotional price is absent", () => {
    expect(
      getProductSalePrice({
        price: 100,
        promotionalPrice: undefined,
      }),
    ).toBe(100);
  });

  it("returns zero when neither price is configured", () => {
    expect(
      getProductSalePrice({
        price: undefined,
        promotionalPrice: undefined,
      }),
    ).toBe(0);
  });
});