// src/data/db/migrations.ts
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec } from "./utils";

export type table = {
	name: string
}

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  const { user_version } = await db.getFirstAsync<{ user_version: number | null }>(
    "PRAGMA user_version"
  );


  if (user_version >= DATABASE_VERSION) return;

  if (user_version === 0) {
    await safeExec(db, "PRAGMA journal_mode = 'wal';")


    
    await safeExec(db,
      `
			CREATE TABLE IF NOT EXISTS entries (
				id          INTEGER PRIMARY KEY AUTOINCREMENT,
				title       TEXT NOT NULL,
				body        TEXT NOT NULL,   
				start       TEXT NOT NULL,
				end         TEXT NOT NULL,
				created_at  TEXT NOT NULL
			);
			`
    )

    await safeExec(db, "PRAGMA foreign_keys = ON;");

    await safeExec(db, `PRAGMA user_version = ${DATABASE_VERSION}`);

    const tables: table[] = await db.getAllAsync(
      `SELECT name FROM sqlite_master WHERE type='table';`
    );

    console.log("Tables in DB:", tables.map(t => t.name));

  }
  
  

	// new tables here for immediate run; then move inside conditional
      
}
