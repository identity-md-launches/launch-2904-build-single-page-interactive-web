import { mkdir, copyFile, readdir, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const out = join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'assets'), { recursive: true });
for (const name of ['index.html', 'styles.css', 'app.js']) await copyFile(join(root, name), join(out, name));
for (const name of await readdir(join(root, 'assets'))) await copyFile(join(root, 'assets', name), join(out, 'assets', name));
console.log('Production export built: dist/ (no runtime dependencies).');
