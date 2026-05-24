const fs = require('fs');

const content = fs.readFileSync('./src/mockDB/seed/notices.js', 'utf8');
const matches = content.match(/id: "notice-\d+"/g);

if (matches) {
  const ids = matches.map(m => m.match(/"([^"]+)"/)[1]);
  const unique = new Set(ids);
  console.log('Total:', ids.length);
  console.log('Unique:', unique.size);
  
  if (ids.length !== unique.size) {
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    console.log('Duplicate IDs:', [...new Set(dup)]);
  } else {
    console.log('No duplicates found');
  }
} else {
  console.log('No matches found');
}
