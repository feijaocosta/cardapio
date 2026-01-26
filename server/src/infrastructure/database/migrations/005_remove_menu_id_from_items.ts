export async function up(db: any): Promise<void> {
  await db.schema.table('items', (table: any) => {
    table.dropForeign('items_ibfk_1');
    table.dropColumn('menu_id');
  });
}

export async function down(db: any): Promise<void> {
  await db.schema.table('items', (table: any) => {
    table.integer('menu_id').nullable();
    table.foreign('menu_id').references('menus.id').onDelete('CASCADE');
  });
}