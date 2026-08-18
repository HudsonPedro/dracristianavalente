import {
  asc,
  eq,
} from "drizzle-orm";

import { getDb } from "../../db";

import {
  inventoryTable,
  type InventoryRow,
  type NewInventoryRow,
} from "../../db/schema/inventory";

import type {
  Inventory,
} from "../../domain/store/inventory";

import type {
  InventoryRepository,
} from "./inventory-repository";

function mapRowToInventory(
  row: InventoryRow,
): Inventory {
  return {
    id: row.id,

    productId: row.productId,

    stockEnabled:
      row.stockEnabled,

    quantityAvailable:
      row.quantityAvailable,

    quantityReserved:
      row.quantityReserved,

    minimumStock:
      row.minimumStock,

    allowBackorder:
      row.allowBackorder,

    updatedAt:
      row.updatedAt.toISOString(),
  };
}

function mapInventoryToRow(
  inventory: Inventory,
): NewInventoryRow {
  return {
    id: inventory.id,

    productId:
      inventory.productId,

    stockEnabled:
      inventory.stockEnabled,

    quantityAvailable:
      inventory.quantityAvailable,

    quantityReserved:
      inventory.quantityReserved,

    minimumStock:
      inventory.minimumStock,

    allowBackorder:
      inventory.allowBackorder,

    updatedAt:
      inventory.updatedAt
        ? new Date(inventory.updatedAt)
        : new Date(),
  };
}

export class DrizzleInventoryRepository
  implements InventoryRepository
{
  async findByProductId(
    productId: string,
  ): Promise<Inventory | null> {
    const db = getDb();

    const [row] = await db
      .select()
      .from(inventoryTable)
      .where(
        eq(
          inventoryTable.productId,
          productId,
        ),
      )
      .limit(1);

    return row
      ? mapRowToInventory(row)
      : null;
  }

  async list(): Promise<Inventory[]> {
    const db = getDb();

    const rows = await db
      .select()
      .from(inventoryTable)
      .orderBy(
        asc(inventoryTable.productId),
      );

    return rows.map(
      mapRowToInventory,
    );
  }

  async save(
    inventory: Inventory,
  ): Promise<Inventory> {
    const db = getDb();

    const [saved] = await db
      .insert(inventoryTable)
      .values(
        mapInventoryToRow(inventory),
      )
      .onConflictDoUpdate({
        target:
          inventoryTable.productId,

        set: {
          stockEnabled:
            inventory.stockEnabled,

          quantityAvailable:
            inventory.quantityAvailable,

          quantityReserved:
            inventory.quantityReserved,

          minimumStock:
            inventory.minimumStock,

          allowBackorder:
            inventory.allowBackorder,

          updatedAt:
            new Date(),
        },
      })
      .returning();

    if (!saved) {
      throw new Error(
        "Não foi possível salvar o estoque.",
      );
    }

    return mapRowToInventory(saved);
  }

  async updateQuantity(
    productId: string,
    quantityAvailable: number,
  ): Promise<Inventory> {
    const db = getDb();

    const [updated] = await db
      .update(inventoryTable)
      .set({
        quantityAvailable,
        updatedAt:
          new Date(),
      })
      .where(
        eq(
          inventoryTable.productId,
          productId,
        ),
      )
      .returning();

    if (!updated) {
      throw new Error(
        `Estoque não encontrado para o produto: ${productId}`,
      );
    }

    return mapRowToInventory(updated);
  }

  async reserve(
    productId: string,
    quantity: number,
  ): Promise<Inventory> {
    const current =
      await this.findByProductId(
        productId,
      );

    if (!current) {
      throw new Error(
        `Estoque não encontrado para o produto: ${productId}`,
      );
    }

    return this.save({
      ...current,

      quantityReserved:
        current.quantityReserved +
        quantity,

      updatedAt:
        new Date().toISOString(),
    });
  }

  async release(
    productId: string,
    quantity: number,
  ): Promise<Inventory> {
    const current =
      await this.findByProductId(
        productId,
      );

    if (!current) {
      throw new Error(
        `Estoque não encontrado para o produto: ${productId}`,
      );
    }

    const nextReserved =
      Math.max(
        0,
        current.quantityReserved -
          quantity,
      );

    return this.save({
      ...current,

      quantityReserved:
        nextReserved,

      updatedAt:
        new Date().toISOString(),
    });
  }

  async commitReservedStock(
    productId: string,
    quantity: number,
  ): Promise<Inventory> {
    const current =
      await this.findByProductId(
        productId,
      );

    if (!current) {
      throw new Error(
        `Estoque não encontrado para o produto: ${productId}`,
      );
    }

    if (
      current.quantityReserved <
      quantity
    ) {
      throw new Error(
        "Quantidade reservada insuficiente.",
      );
    }

    if (
      current.quantityAvailable <
      quantity
    ) {
      throw new Error(
        "Quantidade disponível insuficiente.",
      );
    }

    return this.save({
      ...current,

      quantityAvailable:
        current.quantityAvailable -
        quantity,

      quantityReserved:
        current.quantityReserved -
        quantity,

      updatedAt:
        new Date().toISOString(),
    });
  }
}
