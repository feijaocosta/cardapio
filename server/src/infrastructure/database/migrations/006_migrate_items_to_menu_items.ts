export async function up(db: any): Promise<void> {
  await db.raw(`
    INSERT INTO menu_items (menu_id, item_id, created_at, updated_at)
    SELECT menu_id, id, created_at, updated_at FROM items WHERE menu_id IS NOT NULL
  `);
}

export async function down(db: any): Promise<void> {
  await db.raw('DELETE FROM menu_items');
}