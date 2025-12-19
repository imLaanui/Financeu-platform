const fs = require('fs');

function fixSVGAttributes(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;

    // Fix SVG attributes that are missing spaces between them
    // Match patterns like: attribute="value"nextAttribute="value"
    const attributePattern = /"([a-z])/g;

    const before = content;
    content = content.replace(/"([a-z][a-z-]*=")/g, '" $1');

    if (content !== before) {
        const matches = before.match(/"([a-z][a-z-]*=")/g);
        changes = matches ? matches.length : 0;
        fs.writeFileSync(filePath, content, 'utf8');
    }

    return changes;
}

// Get all HTML files
const files = fs.readdirSync('.')
    .filter(f => f.match(/pillar.*\.html$/));

let totalChanges = 0;
console.log('Fixing SVG attribute spacing...\n');

files.forEach(file => {
    const changes = fixSVGAttributes(file);
    if (changes > 0) {
        console.log(`✓ ${file}: ${changes} attribute spacing fixes`);
        totalChanges += changes;
    }
});

console.log(`\n✅ Complete! Total fixes: ${totalChanges}`);
