// Comprehensive script to replace ALL emojis with SVG icons or text

const fs = require('fs');
const path = require('path');

// Icon SVG templates
const svgIcons = {
    chart: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#EFF6FF"/><path d="M12 32 L16 28 L20 30 L24 22 L28 26 L32 18" stroke="#3B82F6" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="28" r="2" fill="#3B82F6"/><circle cx="20" cy="30" r="2" fill="#3B82F6"/><circle cx="24" cy="22" r="2" fill="#3B82F6"/><circle cx="28" cy="26" r="2" fill="#3B82F6"/><circle cx="32" cy="18" r="2" fill="#3B82F6"/></svg>',
    target: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#DBEAFE"/><circle cx="24" cy="24" r="14" stroke="#3B82F6" stroke-width="2" fill="none"/><circle cx="24" cy="24" r="8" stroke="#3B82F6" stroke-width="2" fill="none"/><circle cx="24" cy="24" r="3" fill="#3B82F6"/></svg>',
    thought: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#F3F4F6"/><circle cx="24" cy="22" r="8" fill="#6B7280" opacity="0.3"/><circle cx="24" cy="22" r="8" stroke="#6B7280" stroke-width="2" fill="none"/><circle cx="18" cy="32" r="3" fill="#6B7280" opacity="0.5"/><circle cx="14" cy="36" r="2" fill="#6B7280" opacity="0.3"/></svg>',
    warning: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#FEF3C7"/><path d="M24 14 L34 32 L14 32 Z" fill="#F59E0B" opacity="0.3"/><path d="M24 14 L34 32 L14 32 Z" stroke="#F59E0B" stroke-width="2" fill="none"/><path d="M24 22V26" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="29" r="1.5" fill="#F59E0B"/></svg>',
    sad: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#FEE2E2"/><circle cx="24" cy="24" r="16" stroke="#DC2626" stroke-width="2" fill="none"/><circle cx="18" cy="20" r="2" fill="#DC2626"/><circle cx="30" cy="20" r="2" fill="#DC2626"/><path d="M16 30 Q24 26 32 30" stroke="#DC2626" stroke-width="2" fill="none"/></svg>',
    devil: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#FEE2E2"/><circle cx="24" cy="24" r="14" fill="#DC2626" opacity="0.3"/><circle cx="24" cy="24" r="14" stroke="#DC2626" stroke-width="2" fill="none"/><path d="M16 16 L18 12 L20 16" stroke="#DC2626" stroke-width="2" fill="none"/><path d="M28 16 L30 12 L32 16" stroke="#DC2626" stroke-width="2" fill="none"/><circle cx="20" cy="22" r="1.5" fill="#DC2626"/><circle cx="28" cy="22" r="1.5" fill="#DC2626"/></svg>',
    party: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#D1FAE5"/><circle cx="24" cy="24" r="14" stroke="#00A676" stroke-width="2" fill="none"/><path d="M18 22 L20 18 L22 22" stroke="#00A676" stroke-width="2" fill="none"/><path d="M26 22 L28 18 L30 22" stroke="#00A676" stroke-width="2" fill="none"/><path d="M16 26 Q24 32 32 26" stroke="#00A676" stroke-width="2" fill="none"/></svg>',
    book: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#EDE9FE"/><rect x="16" y="12" width="16" height="24" rx="1" stroke="#8B5CF6" stroke-width="2" fill="none"/><line x1="20" y1="18" x2="28" y2="18" stroke="#8B5CF6" stroke-width="1.5"/><line x1="20" y1="22" x2="28" y2="22" stroke="#8B5CF6" stroke-width="1.5"/><line x1="20" y1="26" x2="25" y2="26" stroke="#8B5CF6" stroke-width="1.5"/></svg>',
    lightbulb: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#FEF3C7"/><circle cx="24" cy="20" r="6" fill="#F59E0B" opacity="0.3"/><path d="M24 14 C28 14 30 16 30 20 C30 23 28 25 27 26 L27 30 L21 30 L21 26 C20 25 18 23 18 20 C18 16 20 14 24 14" stroke="#F59E0B" stroke-width="2"/><line x1="20" y1="32" x2="28" y2="32" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/></svg>',
    money: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#FEF3C7"/><circle cx="24" cy="24" r="14" stroke="#F59E0B" stroke-width="2"/><path d="M24 16V32M20 20C20 18 22 16 24 16C26 16 28 18 28 20C28 22 26 22 24 22C22 22 20 22 20 24C20 26 22 28 24 28C26 28 28 26 28 24" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/></svg>',
    calendar: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#EFF6FF"/><rect x="14" y="16" width="20" height="18" rx="2" stroke="#3B82F6" stroke-width="2" fill="none"/><line x1="14" y1="22" x2="34" y2="22" stroke="#3B82F6" stroke-width="2"/><line x1="19" y1="14" x2="19" y2="18" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/><line x1="29" y1="14" x2="29" y2="18" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/></svg>',
    gift: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#FCE7F3"/><rect x="16" y="22" width="16" height="12" rx="1" stroke="#EC4899" stroke-width="2" fill="none"/><rect x="14" y="18" width="20" height="4" rx="1" fill="#EC4899" opacity="0.3"/><rect x="14" y="18" width="20" height="4" rx="1" stroke="#EC4899" stroke-width="2" fill="none"/><line x1="24" y1="18" x2="24" y2="34" stroke="#EC4899" stroke-width="2"/><path d="M24 18 Q20 14 18 16" stroke="#EC4899" stroke-width="2" fill="none"/><path d="M24 18 Q28 14 30 16" stroke="#EC4899" stroke-width="2" fill="none"/></svg>',
    coffee: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#FEF3C7"/><path d="M16 20 L16 28 C16 30 18 32 20 32 L28 32 C30 32 32 30 32 28 L32 20" stroke="#F59E0B" stroke-width="2" fill="none"/><line x1="16" y1="20" x2="32" y2="20" stroke="#F59E0B" stroke-width="2"/><path d="M32 22 L34 22 C35 22 36 23 36 24 C36 25 35 26 34 26 L32 26" stroke="#F59E0B" stroke-width="2" fill="none"/></svg>',
    muscle: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#D1FAE5"/><path d="M16 24 Q18 20 22 22 Q24 24 24 28 L24 32" stroke="#00A676" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M32 24 Q30 20 26 22 Q24 24 24 28" stroke="#00A676" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="22" cy="20" r="3" fill="#00A676" opacity="0.3"/><circle cx="26" cy="20" r="3" fill="#00A676" opacity="0.3"/></svg>',
    rocket: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#EFF6FF"/><path d="M24 12 L28 28 L24 26 L20 28 Z" fill="#3B82F6" opacity="0.3"/><path d="M24 12 L28 28 L24 26 L20 28 Z" stroke="#3B82F6" stroke-width="2" fill="none"/><path d="M20 28 L18 34 L24 30 L30 34 L28 28" stroke="#3B82F6" stroke-width="2" fill="none"/><circle cx="24" cy="20" r="2" fill="#3B82F6"/></svg>',
    house: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#DBEAFE"/><path d="M14 24 L24 14 L34 24 L34 34 L14 34 Z" fill="#3B82F6" opacity="0.3"/><path d="M14 24 L24 14 L34 24 L34 34 L14 34 Z" stroke="#3B82F6" stroke-width="2" fill="none"/><rect x="20" y="26" width="8" height="8" fill="#3B82F6"/></svg>',
    food: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#FEF3C7"/><circle cx="24" cy="20" r="6" fill="#F59E0B" opacity="0.3"/><circle cx="24" cy="20" r="6" stroke="#F59E0B" stroke-width="2" fill="none"/><path d="M18 26 L30 26 C30 26 32 26 32 28 L32 30 C32 32 30 32 30 32 L18 32 C18 32 16 32 16 30 L16 28 C16 26 18 26 18 26 Z" fill="#F59E0B" opacity="0.3"/><path d="M18 26 L30 26 C30 26 32 26 32 28 L32 30 C32 32 30 32 30 32 L18 32 C18 32 16 32 16 30 L16 28 C16 26 18 26 18 26 Z" stroke="#F59E0B" stroke-width="2" fill="none"/></svg>',
    phone: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#EFF6FF"/><rect x="18" y="12" width="12" height="24" rx="2" stroke="#3B82F6" stroke-width="2" fill="none"/><line x1="22" y1="32" x2="26" y2="32" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/></svg>',
    movie: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#EDE9FE"/><rect x="14" y="18" width="20" height="14" rx="2" stroke="#8B5CF6" stroke-width="2" fill="none"/><circle cx="18" cy="22" r="1.5" fill="#8B5CF6"/><circle cx="30" cy="22" r="1.5" fill="#8B5CF6"/><circle cx="18" cy="28" r="1.5" fill="#8B5CF6"/><circle cx="30" cy="28" r="1.5" fill="#8B5CF6"/><path d="M20 24 L28 24 L24 28 Z" fill="#8B5CF6"/></svg>',
    car: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#DBEAFE"/><path d="M12 26 L16 22 L20 22 L22 18 L26 18 L28 22 L32 22 L36 26 L36 30 L12 30 Z" fill="#3B82F6" opacity="0.3"/><path d="M12 26 L16 22 L20 22 L22 18 L26 18 L28 22 L32 22 L36 26 L36 30 L12 30 Z" stroke="#3B82F6" stroke-width="2" fill="none"/><circle cx="18" cy="30" r="2" fill="#3B82F6"/><circle cx="30" cy="30" r="2" fill="#3B82F6"/></svg>',
    box: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#F3F4F6"/><rect x="16" y="18" width="16" height="14" rx="1" stroke="#6B7280" stroke-width="2" fill="none"/><line x1="16" y1="22" x2="32" y2="22" stroke="#6B7280" stroke-width="2"/><line x1="24" y1="18" x2="24" y2="32" stroke="#6B7280" stroke-width="2"/></svg>',
    trendingUp: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#D1FAE5"/><path d="M12 30 L18 24 L24 28 L30 18 L36 22" stroke="#00A676" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 14 L36 14 L36 20" stroke="#00A676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    trendingDown: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#FEE2E2"/><path d="M12 18 L18 24 L24 20 L30 30 L36 26" stroke="#DC2626" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 34 L36 34 L36 28" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    puzzle: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#EFF6FF"/><rect x="14" y="14" width="10" height="10" stroke="#3B82F6" stroke-width="2" fill="none"/><rect x="24" y="14" width="10" height="10" stroke="#3B82F6" stroke-width="2" fill="none"/><rect x="14" y="24" width="10" height="10" stroke="#3B82F6" stroke-width="2" fill="none"/><rect x="24" y="24" width="10" height="10" stroke="#3B82F6" stroke-width="2" fill="none"/><circle cx="24" cy="19" r="2" fill="#3B82F6"/></svg>'
};

// Emoji to icon mapping
const emojiMap = {
    '📊': 'chart',
    '🎯': 'target',
    '💭': 'thought',
    '⚠️': 'warning',
    '😔': 'sad',
    '😈': 'devil',
    '🎉': 'party',
    '📚': 'book',
    '💡': 'lightbulb',
    '💰': 'money',
    '📅': 'calendar',
    '🎁': 'gift',
    '☕': 'coffee',
    '💪': 'muscle',
    '🚀': 'rocket',
    '📈': 'trendingUp',
    '💹': 'trendingUp',
    '🏠': 'house',
    '🍔': 'food',
    '📱': 'phone',
    '🎬': 'movie',
    '🚗': 'car',
    '📦': 'box',
    '💸': 'trendingDown',
    '📉': 'trendingDown',
    '🧩': 'puzzle'
};

function replaceEmojisInFile(filePath) {
    console.log(`\n📝 Processing: ${path.basename(filePath)}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let replacementCount = 0;

    // 1. Replace emojis in HTML divs
    for (const [emoji, iconName] of Object.entries(emojiMap)) {
        const svg = svgIcons[iconName];
        if (!svg) continue;

        // Replace in various div classes
        const patterns = [
            new RegExp(`(<div class="(?:intro-card-icon|mistake-icon|reflection-icon|result-icon|budget-method-emoji)">)${emoji}(</div>)`, 'g'),
            new RegExp(`(<div class="checklist-title">)${emoji}([^<]+</div>)`, 'g')
        ];

        patterns.forEach(regex => {
            const beforeCount = (content.match(regex) || []).length;
            if (beforeCount > 0) {
                content = content.replace(regex, `$1${svg}$2`);
                replacementCount += beforeCount;
                console.log(`   ✓ Replaced ${beforeCount} instance(s) of ${emoji} (HTML)`);
            }
        });
    }

    // 2. Replace emojis in CSS pseudo-elements (content: 'emoji')
    for (const [emoji, iconName] of Object.entries(emojiMap)) {
        const regex = new RegExp(`content:\\s*['"]${emoji}['"]`, 'g');
        const beforeCount = (content.match(regex) || []).length;
        if (beforeCount > 0) {
            content = content.replace(regex, `content: ''`); // Remove emoji from CSS
            replacementCount += beforeCount;
            console.log(`   ✓ Removed ${beforeCount} instance(s) of ${emoji} (CSS)`);
        }
    }

    // 3. Replace emojis in JavaScript assignments
    for (const [emoji, iconName] of Object.entries(emojiMap)) {
        const patterns = [
            new RegExp(`textContent\\s*=\\s*['"]${emoji}['"]`, 'g'),
            new RegExp(`innerHTML\\s*=\\s*['"]${emoji}['"]`, 'g')
        ];

        patterns.forEach(regex => {
            const beforeCount = (content.match(regex) || []).length;
            if (beforeCount > 0) {
                content = content.replace(regex, match => {
                    if (match.includes('textContent')) {
                        return `textContent = '${iconName === 'party' ? '✓' : '•'}'`;
                    }
                    return match;
                });
                replacementCount += beforeCount;
                console.log(`   ✓ Replaced ${beforeCount} instance(s) of ${emoji} (JS)`);
            }
        });
    }

    // 4. Replace specific patterns
    content = content.replace(/checkbox\.textContent\s*=\s*'✓'/g, "checkbox.innerHTML = '<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2 8 L6 12 L14 4\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>'");

    if (replacementCount > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`   ✅ Total replacements: ${replacementCount}`);
        return replacementCount;
    } else {
        console.log(`   ℹ️  No emojis found to replace`);
        return 0;
    }
}

// Find all lesson HTML files
const lessonFiles = fs.readdirSync(__dirname)
    .filter(file => file.match(/pillar\d+-lesson\d+\.html/) && !file.includes('.backup'));

console.log(`\n🔄 Found ${lessonFiles.length} lesson files to process\n`);

let totalReplacements = 0;
lessonFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    totalReplacements += replaceEmojisInFile(filePath);
});

console.log(`\n✅ Complete! Total replacements across all files: ${totalReplacements}\n`);
