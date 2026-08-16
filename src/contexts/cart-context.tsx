import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { products } from "../data/products";
import type { Product } from "../types/product";

/* =========================================================
   TIPOS
   ========================================================= */

export type CartItem = {
  product: Product;
  quantity: number;
};

type StoredCartItem = {
  productId: string;
  quantity: number;
};

type AddToCartResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason: string;
    };

type CartContextValue = {
  items: CartItem[];

  totalItems: number;
  subtotal: number;
  isEmpty: boolean;
  isHydrated: boolean;

  addItem: (
    product: Product,
    quantity?: number,
  ) => AddToCartResult;

  removeItem: (productId: string) => void;

  setQuantity: (
    productId: string,
    quantity: number,
  ) => void;

  incrementItem: (productId: string) => void;

  decrementItem: (productId: string) => void;

  clearCart: () => void;

  isInCart: (productId: string) => boolean;

  getItemQuantity: (productId: string) => number;
};

/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const STORAGE_KEY = "dra-cristiana-produtos-cart-v1";

const CartContext =
  createContext<CartContextValue | null>(null);

/* =========================================================
   REGRAS DE VENDA

   IMPORTANTE:
   produto só entra no carrinho quando estiver realmente
   liberado para venda online.

   Produtos condicionados a avaliação ou protocolo continuam
   fora do carrinho.
   ========================================================= */

export function canProductBeAddedToCart(
  product: Product,
): AddToCartResult {
  if (product.status !== "ACTIVE") {
    return {
      success: false,
      reason: "Produto indisponível.",
    };
  }

  if (!product.saleEnabled) {
    return {
      success: false,
      reason:
        "Este produto ainda não está liberado para compra online.",
    };
  }

  if (product.requiresEvaluation) {
    return {
      success: false,
      reason:
        "Este produto requer avaliação profissional antes da aquisição.",
    };
  }

  if (product.requiresProtocol) {
    return {
      success: false,
      reason:
        "Este produto está vinculado a um protocolo profissional.",
    };
  }

  if (product.priceVisibility !== "SHOW_PRICE") {
    return {
      success: false,
      reason:
        "Este produto não possui venda direta habilitada.",
    };
  }

  if (typeof product.price !== "number") {
    return {
      success: false,
      reason:
        "Preço de venda ainda não configurado.",
    };
  }

  if (product.availability !== "AVAILABLE") {
    return {
      success: false,
      reason:
        "Produto indisponível para compra neste momento.",
    };
  }

  return {
    success: true,
  };
}

/* =========================================================
   PREÇO EFETIVO
   ========================================================= */

export function getProductSalePrice(
  product: Product,
): number {
  if (
    typeof product.promotionalPrice === "number"
  ) {
    return product.promotionalPrice;
  }

  if (typeof product.price === "number") {
    return product.price;
  }

  return 0;
}

/* =========================================================
   NORMALIZAÇÃO DE QUANTIDADE
   ========================================================= */

function normalizeQuantity(
  quantity: number,
): number {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(
    1,
    Math.floor(quantity),
  );
}

/* =========================================================
   PROVIDER
   ========================================================= */

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({
  children,
}: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(
    [],
  );

  const [isHydrated, setIsHydrated] =
    useState(false);

  /* =======================================================
     CARREGAR CARRINHO

     Armazenamos apenas ID + quantidade.

     O produto sempre é recuperado novamente do products.ts.

     Assim:
     - alterações de preço são atualizadas;
     - imagens atualizam;
     - descrição atualiza;
     - produtos removidos deixam de aparecer;
     - novos produtos continuam usando a mesma estrutura.
     ======================================================= */

  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(
          STORAGE_KEY,
        );

      if (!stored) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(
        stored,
      ) as StoredCartItem[];

      if (!Array.isArray(parsed)) {
        setIsHydrated(true);
        return;
      }

      const restoredItems: CartItem[] =
        parsed
          .map((storedItem) => {
            const product = products.find(
              (item) =>
                item.id ===
                storedItem.productId,
            );

            if (!product) {
              return null;
            }

            const eligibility =
              canProductBeAddedToCart(
                product,
              );

            if (!eligibility.success) {
              return null;
            }

            return {
              product,
              quantity:
                normalizeQuantity(
                  storedItem.quantity,
                ),
            };
          })
          .filter(
            (
              item,
            ): item is CartItem =>
              item !== null,
          );

      setItems(restoredItems);
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  /* =======================================================
     SALVAR CARRINHO
     ======================================================= */

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const data: StoredCartItem[] =
      items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data),
      );
    } catch {
      // O carrinho continua funcionando em memória
      // caso o navegador bloqueie localStorage.
    }
  }, [items, isHydrated]);

  /* =======================================================
     ADICIONAR
     ======================================================= */

  const addItem = useCallback(
    (
      product: Product,
      quantity = 1,
    ): AddToCartResult => {
      const eligibility =
        canProductBeAddedToCart(product);

      if (!eligibility.success) {
        return eligibility;
      }

      const safeQuantity =
        normalizeQuantity(quantity);

      setItems((currentItems) => {
        const existing =
          currentItems.find(
            (item) =>
              item.product.id ===
              product.id,
          );

        if (existing) {
          return currentItems.map(
            (item) =>
              item.product.id ===
              product.id
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      safeQuantity,
                  }
                : item,
          );
        }

        return [
          ...currentItems,
          {
            product,
            quantity: safeQuantity,
          },
        ];
      });

      return {
        success: true,
      };
    },
    [],
  );

  /* =======================================================
     REMOVER
     ======================================================= */

  const removeItem = useCallback(
    (productId: string) => {
      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.product.id !== productId,
        ),
      );
    },
    [],
  );

  /* =======================================================
     DEFINIR QUANTIDADE
     ======================================================= */

  const setQuantity = useCallback(
    (
      productId: string,
      quantity: number,
    ) => {
      if (
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        setItems((currentItems) =>
          currentItems.filter(
            (item) =>
              item.product.id !==
              productId,
          ),
        );

        return;
      }

      const safeQuantity =
        normalizeQuantity(quantity);

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: safeQuantity,
              }
            : item,
        ),
      );
    },
    [],
  );

  /* =======================================================
     INCREMENTAR
     ======================================================= */

  const incrementItem =
    useCallback(
      (productId: string) => {
        setItems((currentItems) =>
          currentItems.map((item) =>
            item.product.id ===
            productId
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item,
          ),
        );
      },
      [],
    );

  /* =======================================================
     DIMINUIR
     ======================================================= */

  const decrementItem =
    useCallback(
      (productId: string) => {
        setItems((currentItems) =>
          currentItems.flatMap(
            (item) => {
              if (
                item.product.id !==
                productId
              ) {
                return [item];
              }

              if (
                item.quantity <= 1
              ) {
                return [];
              }

              return [
                {
                  ...item,
                  quantity:
                    item.quantity - 1,
                },
              ];
            },
          ),
        );
      },
      [],
    );

  /* =======================================================
     LIMPAR
     ======================================================= */

  const clearCart =
    useCallback(() => {
      setItems([]);
    }, []);

  /* =======================================================
     CONSULTAS
     ======================================================= */

  const isInCart = useCallback(
    (productId: string) =>
      items.some(
        (item) =>
          item.product.id === productId,
      ),
    [items],
  );

  const getItemQuantity =
    useCallback(
      (productId: string) =>
        items.find(
          (item) =>
            item.product.id ===
            productId,
        )?.quantity ?? 0,
      [items],
    );

  /* =======================================================
     TOTAIS
     ======================================================= */

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          getProductSalePrice(
            item.product,
          ) *
            item.quantity,
        0,
      ),
    [items],
  );

  const value =
    useMemo<CartContextValue>(
      () => ({
        items,

        totalItems,
        subtotal,

        isEmpty:
          items.length === 0,

        isHydrated,

        addItem,
        removeItem,
        setQuantity,
        incrementItem,
        decrementItem,
        clearCart,

        isInCart,
        getItemQuantity,
      }),
      [
        items,
        totalItems,
        subtotal,
        isHydrated,
        addItem,
        removeItem,
        setQuantity,
        incrementItem,
        decrementItem,
        clearCart,
        isInCart,
        getItemQuantity,
      ],
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================================================
   HOOK
   ========================================================= */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart deve ser utilizado dentro de CartProvider.",
    );
  }

  return context;
}
