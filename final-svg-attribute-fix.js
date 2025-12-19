const fs = require('fs');

function finalFixSVGAttributes(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;

    // Fix specific missing spaces in SVG attributes
    const patterns = [
        { regex: /"viewBox/g, replacement: '" viewBox' },
        { regex: /"fill/g, replacement: '" fill' },
        { regex: /"stroke/g, replacement: '" stroke' },
        { regex: /"xmlns/g, replacement: '" xmlns' },
        { regex: /"cx/g, replacement: '" cx' },
        { regex: /"cy/g, replacement: '" cy' },
        { regex: /"r=/g, replacement: '" r=' },
        { regex: /"x=/g, replacement: '" x=' },
        { regex: /"y=/g, replacement: '" y=' },
        { regex: /"d=/g, replacement: '" d=' },
        { regex: /"points/g, replacement: '" points' },
        { regex: /"opacity/g, replacement: '" opacity' },
        { regex: /"rx/g, replacement: '" rx' },
        { regex: /"ry/g, replacement: '" ry' },
        { regex: /"transform/g, replacement: '" transform' },
        { regex: /"text-anchor/g, replacement: '" text-anchor' },
        { regex: /"font-size/g, replacement: '" font-size' },
        { regex: /"font-weight/g, replacement: '" font-weight' },
    ];

    patterns.forEach(({ regex, replacement }) => {
        const before = content;
        content = content.replace(regex, replacement);
        if (content !== before) {
            const matches = before.match(regex);
            changes += matches ? matches.length : 0;
        }
    });

    if (changes > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
    }

    return changes;
}

// Get all HTML files
const files = fs.readdirSync('.')
    .filter(f => f.match(/pillar.*\.html$/));

let totalChanges = 0;
console.log('Final SVG attribute spacing fixes...\n');

files.forEach(file => {
    const changes = finalFixSVGAttributes(file);
    if (changes > 0) {
        console.log(`✓ ${file}: ${changes} fixes`);
        totalChanges += changes;
    }
});

console.log(`\n✅ Complete! Total fixes: ${totalChanges}`);
