const fs = require('fs');
const path = require('path');

const matchColors = (content) => {
  // Overwrite stray colors to black, white, and green
  content = content.replace(/#ffebee/g, '#f5f5f5');
  content = content.replace(/#fff3e0/g, '#f5f5f5');
  content = content.replace(/#e3f2fd/g, '#f5f5f5');
  content = content.replace(/#667eea/g, '#000000');
  content = content.replace(/#f57c00/g, '#000000');
  return content;
}

const dir = './src/pages/auth';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = matchColors(content);
  
  let modified = false;

  if (content.includes('type=\"password\"') && !content.includes('showPassword')) {
    if (!content.includes('InputAdornment')) {
      content = content.replace(/from '@mui\/material'/, '  InputAdornment,\n  IconButton,\n} from \'@mui/material\'');
    }
    if (!content.includes('VisibilityOff')) {
      content = content.replace(/from '@mui\/icons-material'/, '  Visibility,\n  VisibilityOff,\n  Person,\n  Lock,\n  Settings as SettingsIcon\n} from \'@mui/icons-material\'');
    }
    
    // Insert state cleanly (assuming 'const [loading, setLoading] = useState(false)' exists)
    content = content.replace(/const \[loading, setLoading\] = useState\(false\)/, 'const [loading, setLoading] = useState(false)\n  const [showPassword, setShowPassword] = useState(false)');
    
    // Replace password inputs
    content = content.replace(/type=\"password\"([^>]*)\/>/g, (match, p1) => {
      if (p1.includes('InputProps')) return match;
      return 'type={showPassword ? \"text\" : \"password\"}' + p1 + '\n                InputProps={{\n                  startAdornment: (\n                    <InputAdornment position=\"start\">\n                      <Lock sx={{ color: \"#00c853\" }} />\n                    </InputAdornment>\n                  ),\n                  endAdornment: (\n                    <InputAdornment position=\"end\">\n                      <IconButton onClick={() => setShowPassword(!showPassword)} edge=\"end\" sx={{ color: \"#000000\" }}>\n                        {showPassword ? <VisibilityOff sx={{ color: \"#000000\"}} /> : <Visibility sx={{ color: \"#00c853\"}} />}\n                      </IconButton>\n                    </InputAdornment>\n                  )\n                }}\n              />';
    });
    
    // Replace email/phone inputs with person icon
    content = content.replace(/name=\"(email|phone|username)\"([^>]*)\/>/g, (match, type, p2) => {
      if (p2.includes('InputProps')) return match;
      return 'name=\"' + type + '\"' + p2 + '\n                InputProps={{\n                  startAdornment: (\n                    <InputAdornment position=\"start\">\n                      <Person sx={{ color: \"#00c853\" }} />\n                    </InputAdornment>\n                  )\n                }}\n              />';
    });

    modified = true;
  }
  
  if (modified || content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
});
