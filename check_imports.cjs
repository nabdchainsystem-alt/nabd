const fs = require('fs');
const path = require('path');
const icons = require('phosphor-react');
const validIcons = new Set(Object.keys(icons));

console.log(`Loaded ${validIcons.size} valid icons.`);

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles('/Users/max/nabd/src');
console.log(`Checking ${files.length} files...`);

let invalidCount = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/import\s+{([^}]+)}\s+from\s+['"]phosphor-react['"]/);
    if (match) {
        const importString = match[1].replace(/\n/g, ' ');
        const imports = importString.split(',').map(s => s.trim()).filter(s => s);
        imports.forEach(imp => {
            const parts = imp.split(/\s+as\s+/);
            const originalName = parts[0];
            if (originalName && !validIcons.has(originalName)) {
                console.log(`Invalid import '${originalName}' in ${file}`);
                invalidCount++;
            }
        });
    }
});

console.log(`Scan complete. Found ${invalidCount} invalid imports.`);
