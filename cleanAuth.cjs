const fs = require('fs');
const path = require('path');

const dir = './src/pages/auth';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add missing commas before InputAdornment or Visibility
  content = content.replace(/([a-zA-Z0-9_]+)\s+InputAdornment,/g, '$1,\n  InputAdornment,');
  content = content.replace(/([a-zA-Z0-9_]+)\s+Visibility,/g, '$1,\n  Visibility,');

  // Clean duplicate exports correctly. This regex will just remove duplicate exact lines
  content = content.replace(/^\s*Lock,\s*$/gm, '');
  content = content.replace(/^\s*Lock\s*$/gm, '');

  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g, (match, p1, p2) => {
    // split by comma, and map. We won't split by \n.
    let parts = p1.split(',').map(s => s.trim().replace(/\n/g, '')).filter(s => s);
    // But wait, the missing commas created single items with spaces like "Divider InputAdornment"
    // Let's fix that.
    let fixedParts = [];
    parts.forEach(p => {
        // If there is a space that's not part of an 'as' clause
        if (p.includes(' ') && !p.includes(' as ')) {
            fixedParts.push(...p.split(/\s+/));
        } else {
            fixedParts.push(p);
        }
    });

    let unique = [...new Set(fixedParts)];
    
    // Add Lock if it's icons-material but missing Lock. But wait, I stripped Lock before. Let's add it back manually if @mui/icons-material
    if (p2 === '@mui/icons-material' && !unique.includes('Lock')) {
        unique.push('Lock');
    }

    return `import {\n  ${unique.join(',\n  ')}\n} from '${p2}'`;
  });

  fs.writeFileSync(filePath, content);
});
console.log('Fixed missing commas in Auth files');
