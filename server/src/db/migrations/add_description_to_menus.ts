export async function up(db: Database): Promise<void> {
  await db.exec(`
    ALTER TABLE menus ADD COLUMN description TEXT;
  `);
}

export async function down(db: Database): Promise<void> {
  // SQLite doesn't support DROP COLUMN easily, so we'll create a new table without the column
  await db.exec(`
    CREATE TABLE menus_new AS SELECT id, name, active, logo_filename FROM menus;
    DROP TABLE menus;
    ALTER TABLE menus_new RENAME TO menus;
  `);
}