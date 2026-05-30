import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.md')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

const replacements = [
  { bad: "â”€", good: "─" },
  { bad: "â€“", good: "–" },
  { bad: "â€”", good: "—" },
  { bad: "â†’", good: "→" },
  { bad: "â†“", good: "↓" },
  { bad: "â†‘", good: "↑" },
  { bad: "â€™", good: "’" },
  { bad: "â€œ", good: "“" },
  { bad: "â€", good: "”" },
  { bad: "â˜…", good: "★" },
  { bad: "â­ ", good: "⭐" },
  { bad: "â€ ", good: "” " }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Custom manual fix for the About.jsx quote
  if (content.includes("lived in.â€ ")) {
    content = content.replace("lived in.â€ ", "lived in.”\"");
    content = content.replace("lived in.”\"", "lived in.”"); // Fix if I messed up
    changed = true;
  }

  replacements.forEach(r => {
    if (content.includes(r.bad)) {
      content = content.split(r.bad).join(r.good);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
