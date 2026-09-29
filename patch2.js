const fs = require('fs');
const file = 'frontend/src/components/social-card/CardCanvas.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /width: config\.width,\s+height: config\.height,/m,
  "width: config.width,\n        height: config.height,\n        style: { transform: 'scale(1)' },"
);

fs.writeFileSync(file, content);
