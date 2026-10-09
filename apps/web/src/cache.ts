import { openDB } from 'idb';
const database = () => openDB('netec-learning-cache', 1, { upgrade(db) { db.createObjectStore('accounts'); } });
export async function writeAccountCache(sub: string, data: unknown) {
 const db = await database(); try { await db.put('accounts', data, sub); } finally { db.close(); }
}
export async function readAccountCache(sub: string) {
 const db = await database(); try { return await db.get('accounts', sub); } finally { db.close(); }
}
export async function clearAccountCache(sub: string) {
 const db = await database(); try { await db.delete('accounts', sub); } finally { db.close(); }
}
