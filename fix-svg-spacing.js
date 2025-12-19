const fs = require('fs');
const path = require('path');

// CSS to add for proper SVG alignment
const svgAlignmentCSS = `
        /* SVG Icon Alignment Fixes */
        svg {
            display: inline-block;
            vertical-align: middle;
        }

        .intro-card-icon svg,
        .mistake-icon svg,
        .reflection-icon svg,
        .result-icon svg {
            display: block;
            margin: 0 auto;
        }

        .budget-method-emoji svg,
        .budget-item-label svg {
            display: inline-block;
            vertical-align: middle;
            margin-right: 8px;
        }

        p svg, li svg, span svg {
            display: inline-block;
            vertical-align: middle;
            margin: 0 2px;
        }
`;

function fixSVGSpacing(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;

    // 1. Add SVG alignment CSS if not already present
    if (content.includes('<style>') && !content.includes('SVG Icon Alignment Fixes')) {
        content = content.replace('<style>', '<style>' + svgAlignmentCSS);
        changes++;
        console.log(`  Added SVG alignment CSS`);
    }

    // 2. Minify multi-line SVGs to single lines
    // Match SVG tags that span multiple lines and collapse whitespace
    const svgMultilineRegex = /<svg[^>]*>[\s\S]*?<\/svg>/g;
    const svgs = content.match(svgMultilineRegex);

    if (svgs) {
        svgs.forEach(svg => {
            // Minify: remove line breaks and extra whitespace between tags
            const minified = svg
                .replace(/>\s+</g, '><')  // Remove whitespace between tags
                .replace(/\s+/g, ' ')      // Collapse multiple spaces to single space
                .replace(/\s+>/g, '>')     // Remove space before closing >
                .replace(/"\s+([a-z])/g, '" $1')  // Keep space between attributes
                .trim();

            if (minified !== svg) {
                content = content.replace(svg, minified);
                changes++;
            }
        });
        console.log(`  Minified ${changes - 1} multi-line SVGs`);
    }

    // 3. Remove leftover emoji characters after </svg>
    const leftovers = content.match(/<\/svg>[️⚡🔥💪🎉🎯🌟✨💡📚🎓🏆💰]/g);
    if (leftovers) {
        content = content.replace(/<\/svg>[️⚡🔥💪🎉🎯🌟✨💡📚🎓🏆💰]/g, '</svg>');
        console.log(`  Removed ${leftovers.length} leftover emoji characters`);
        changes += leftovers.length;
    }

    // 4. Fix inline SVG spacing in text - ensure proper spacing around SVGs
    // Add space after SVG if it's followed by a letter/number
    content = content.replace(/<\/svg>([a-zA-Z0-9])/g, '</svg> $1');

    // Add space before SVG if it's preceded by a letter/number
    content = content.replace(/([a-zA-Z0-9])<svg/g, '$1 <svg');

    if (changes > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
    }

    return changes;
}

// Get all HTML files
const files = fs.readdirSync('.')
    .filter(f => f.match(/pillar.*\.html$/));

let totalChanges = 0;
console.log('Fixing SVG spacing issues...\n');

files.forEach(file => {
    const changes = fixSVGSpacing(file);
    if (changes > 0) {
        console.log(`✓ ${file}: ${changes} fixes`);
        totalChanges += changes;
    }
});

console.log(`\n✅ Complete! Total fixes: ${totalChanges}`);
