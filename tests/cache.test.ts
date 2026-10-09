import 'fake-indexeddb/auto';
import { expect, it } from 'vitest';
import { writeAccountCache, readAccountCache, clearAccountCache } from '../apps/web/src/cache';
it('isolates cached stats by account and clears only the signing-out account', async () => {
 await writeAccountCache('alice',{answered:7}); await writeAccountCache('bob',{answered:2});
 expect(await readAccountCache('alice')).toEqual({answered:7});
 await clearAccountCache('alice');
 expect(await readAccountCache('alice')).toBeUndefined(); expect(await readAccountCache('bob')).toEqual({answered:2});
});
