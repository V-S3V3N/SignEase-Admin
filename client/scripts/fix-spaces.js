import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexFile = join(__dirname, '../build/index.html');

try {
  let content = readFileSync(indexFile, 'utf8');
  
  // Fix 1: Remove spaces after "SignEase-Admin"
  content = content.replace(/SignEase-Admin \//g, 'SignEase-Admin/');
  
  // Fix 2: Ensure no double slashes
  content = content.replace(/SignEase-Admin\/\//g, 'SignEase-Admin/');
  
  writeFileSync(indexFile, content);
  console.log('✅ Fixed spaces in index.html');
} catch (err) {
  console.error('❌ Error fixing spaces:', err);
  process.exit(1);
}