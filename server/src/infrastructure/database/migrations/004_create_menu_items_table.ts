export async function up(db: any): Promise<void> {
  await db.schema.createTable('menu_items', (table: any) => {
    table.increments('id').primary();
    table.integer('menu_id').notNullable();
    table.integer('item_id').notNullable();
    table.timestamps(true, true);

    table.unique(['menu_id', 'item_id']);
    table.index('menu_id');
    table.index('item_id');

    table.foreign('menu_id').references('menus.id').onDelete('CASCADE');
    table.foreign('item_id').references('items.id').onDelete('CASCADE');
  });
}

export async function down(db: any): Promise<void> {
  await db.schema.dropTable('menu_items');
}