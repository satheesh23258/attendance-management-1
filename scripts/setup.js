import { existsSync, copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const envExample = join(rootDir, '.env.example');
const envFile = join(rootDir, '.env');

if (!existsSync(envFile)) {
  copyFileSync(envExample, envFile);
  console.log('✓ Created .env from .env.example');
} else {
  console.log('✓ .env already exists');
}
