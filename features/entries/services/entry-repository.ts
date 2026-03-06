
import { safeRun, safeSelectAll, safeSelectOne } from "@/db/utils";
import { SQLiteDatabase } from "expo-sqlite";
import { CreateEntryParams, EntryType, UpdateEntryParams } from "../types";

export async function create(db: SQLiteDatabase, params: CreateEntryParams): Promise<number> {
  const result = await safeRun(db,
    "INSERT INTO entries (title, body, start, end, created_at) VALUES (?, ?, ?, ?, ?)",
    [params.title, params.body, params.start, params.end, params.created_at,]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase): Promise<EntryType[]> {
  return await safeSelectAll<EntryType>(db, "SELECT * FROM entries ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<EntryType>(db, "SELECT * FROM entries WHERE id = ?", [id]);
}

// export async function getAllByType(
//   db: SQLiteDatabase,
//   type: string
// ) {
//   return await safeSelectAll<EntryType>(db, "SELECT * FROM entries WHERE type = ?", [type]);
// }

export async function getByName(
  db: SQLiteDatabase,
  name: string
): Promise<EntryType | null> {
  return await safeSelectOne<EntryType>(db, "SELECT * FROM entries WHERE name = ?", [name]);
}


export async function update(
  db: SQLiteDatabase, 
  data: {
    id: number; 
    params: UpdateEntryParams 
  }) {
  const { id, params } = data;

  const setClauses: string[] = [];
  const values: any[] = [];

  for (const key of Object.keys(params) as Array<keyof UpdateEntryParams>) {
    const value = params[key];
    if (value !== undefined) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) return 0; // nothing to update

  values.push(id); // for WHERE clause
  const query = `UPDATE entries SET ${setClauses.join(', ')} WHERE id = ?`;

  const result = await safeRun(db, query, values);
  return result.changes;
}


export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM entries WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number): Promise<boolean> {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM entries WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

