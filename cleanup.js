import fs from 'fs';

let c = fs.readFileSync('src/mockDB/seed/expandedTeachers.js', 'utf8');

c = c.replace(/^\s*"class-[\w]+",?.*$/gm, '');
c = c.replace(/^\s*"[A-D]",?.*$/gm, '');
c = c.replace(/^\s*"\d+",?.*$/gm, '');
c = c.replace(/^\s*\],?$/gm, '');

// Also remove trailing commas left by previous operations if any
c = c.replace(/,\s*}/g, '\n    }');

fs.writeFileSync('src/mockDB/seed/expandedTeachers.js', c);
console.log('Cleanup script finished.');
