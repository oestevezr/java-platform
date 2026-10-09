import { build } from 'esbuild';
await build({ entryPoints: ['src/handler.ts'], outfile: 'dist/handler.mjs', bundle: true, platform: 'node', target: 'node22', format: 'esm', sourcemap: false });
