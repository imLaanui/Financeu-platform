// Script to replace emojis with SVG icons in lesson files

const fs = require('fs');
const path = require('path');

// Emoji to icon mapping
const emojiToIcon = {
    '🚨': 'alert',
    '🛡️': 'shield',
    '🎯': 'target',
    '💰': 'money',
    '💸': 'trendingDown',
    '💳': 'card',
    '📊': 'chart',
    '📈': 'trendingUp',
    '📉': 'trendingDown',
    '💡': 'lightbulb',
    '🎓': 'book',
    '✨': 'check',
    '❌': 'error',
    '✅': 'check',
    '🔒': 'lock',
    '🏦': 'bank',
    '⏸️': 'pause',
    '⏯️': 'pause',
    '🏠': 'house',
    '🐷': 'piggybank',
    '💵': 'money',
    '💲': 'money',
    '🪙': 'coins',
    '⏰': 'clock',
    '⏱️': 'clock',
    '🧮': 'calculator',
    '🎭': 'error',
    '📱': 'card',
    '⚖️': 'target',
    '🔢': 'calculator'
};

// SVG templates
const svgIcons = {
    alert: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#FEE2E2"/>
        <path d="M24 14V26" stroke="#DC2626" stroke-width="3" stroke-linecap="round"/>
        <circle cx="24" cy="32" r="2" fill="#DC2626"/>
    </svg>`,

    shield: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#D1FAE5"/>
        <path d="M24 10 L32 14 L32 24 C32 30 28 34 24 38 C20 34 16 30 16 24 L16 14 Z" fill="#00A676" opacity="0.3"/>
        <path d="M24 10 L32 14 L32 24 C32 30 28 34 24 38 C20 34 16 30 16 24 L16 14 Z" stroke="#00A676" stroke-width="2" fill="none"/>
        <path d="M20 24 L22 26 L28 20" stroke="#00A676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    target: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#DBEAFE"/>
        <circle cx="24" cy="24" r="14" stroke="#3B82F6" stroke-width="2" fill="none"/>
        <circle cx="24" cy="24" r="8" stroke="#3B82F6" stroke-width="2" fill="none"/>
        <circle cx="24" cy="24" r="3" fill="#3B82F6"/>
    </svg>`,

    money: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#FEF3C7"/>
        <circle cx="24" cy="24" r="14" stroke="#F59E0B" stroke-width="2"/>
        <path d="M24 16V32M20 20C20 18 22 16 24 16C26 16 28 18 28 20C28 22 26 22 24 22C22 22 20 22 20 24C20 26 22 28 24 28C26 28 28 26 28 24" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    check: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#D1FAE5"/>
        <path d="M14 24 L20 30 L34 16" stroke="#00A676" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    error: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#FEE2E2"/>
        <path d="M16 16 L32 32 M32 16 L16 32" stroke="#DC2626" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    chart: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#EFF6FF"/>
        <path d="M12 32 L16 28 L20 30 L24 22 L28 26 L32 18" stroke="#3B82F6" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="16" cy="28" r="2" fill="#3B82F6"/>
        <circle cx="20" cy="30" r="2" fill="#3B82F6"/>
        <circle cx="24" cy="22" r="2" fill="#3B82F6"/>
        <circle cx="28" cy="26" r="2" fill="#3B82F6"/>
        <circle cx="32" cy="18" r="2" fill="#3B82F6"/>
    </svg>`,

    lightbulb: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#FEF3C7"/>
        <circle cx="24" cy="20" r="6" fill="#F59E0B" opacity="0.3"/>
        <path d="M24 14 C28 14 30 16 30 20 C30 23 28 25 27 26 L27 30 L21 30 L21 26 C20 25 18 23 18 20 C18 16 20 14 24 14" stroke="#F59E0B" stroke-width="2"/>
        <line x1="20" y1="32" x2="28" y2="32" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    book: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#EDE9FE"/>
        <rect x="16" y="12" width="16" height="24" rx="1" stroke="#8B5CF6" stroke-width="2" fill="none"/>
        <line x1="20" y1="18" x2="28" y2="18" stroke="#8B5CF6" stroke-width="1.5"/>
        <line x1="20" y1="22" x2="28" y2="22" stroke="#8B5CF6" stroke-width="1.5"/>
        <line x1="20" y1="26" x2="25" y2="26" stroke="#8B5CF6" stroke-width="1.5"/>
    </svg>`,

    lock: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#F3F4F6"/>
        <rect x="18" y="22" width="12" height="10" rx="1" fill="#6B7280"/>
        <path d="M20 22 L20 18 C20 16 21 14 24 14 C27 14 28 16 28 18 L28 22" stroke="#6B7280" stroke-width="2" fill="none"/>
        <circle cx="24" cy="27" r="1.5" fill="#F9FAFB"/>
    </svg>`,

    card: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#EFF6FF"/>
        <rect x="12" y="18" width="24" height="16" rx="2" fill="#3B82F6" opacity="0.3"/>
        <rect x="12" y="18" width="24" height="16" rx="2" stroke="#3B82F6" stroke-width="2" fill="none"/>
        <rect x="12" y="21" width="24" height="4" fill="#3B82F6"/>
        <line x1="15" y1="29" x2="21" y2="29" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    calculator: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#D1FAE5"/>
        <rect x="16" y="12" width="16" height="24" rx="2" stroke="#00A676" stroke-width="2" fill="none"/>
        <rect x="18" y="14" width="12" height="6" fill="#00A676" opacity="0.3"/>
        <circle cx="20" cy="24" r="1.5" fill="#00A676"/>
        <circle cx="24" cy="24" r="1.5" fill="#00A676"/>
        <circle cx="28" cy="24" r="1.5" fill="#00A676"/>
        <circle cx="20" cy="28" r="1.5" fill="#00A676"/>
        <circle cx="24" cy="28" r="1.5" fill="#00A676"/>
        <circle cx="28" cy="28" r="1.5" fill="#00A676"/>
    </svg>`,

    coins: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#FEF3C7"/>
        <circle cx="20" cy="22" r="6" fill="#F59E0B" opacity="0.3"/>
        <circle cx="20" cy="22" r="6" stroke="#F59E0B" stroke-width="2" fill="none"/>
        <circle cx="28" cy="22" r="6" fill="#F59E0B" opacity="0.5"/>
        <circle cx="28" cy="22" r="6" stroke="#F59E0B" stroke-width="2" fill="none"/>
        <circle cx="24" cy="27" r="6" fill="#F59E0B" opacity="0.7"/>
        <circle cx="24" cy="27" r="6" stroke="#F59E0B" stroke-width="2" fill="none"/>
    </svg>`,

    piggybank: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#FCE7F3"/>
        <ellipse cx="24" cy="24" rx="10" ry="8" fill="#EC4899" opacity="0.3"/>
        <ellipse cx="24" cy="24" rx="10" ry="8" stroke="#EC4899" stroke-width="2" fill="none"/>
        <rect x="22" y="16" width="4" height="3" rx="1" fill="#EC4899"/>
        <circle cx="20" cy="23" r="1" fill="#EC4899"/>
        <path d="M28 28 L30 32" stroke="#EC4899" stroke-width="2" stroke-linecap="round"/>
        <path d="M20 28 L18 32" stroke="#EC4899" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    house: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#DBEAFE"/>
        <path d="M14 24 L24 14 L34 24 L34 34 L14 34 Z" fill="#3B82F6" opacity="0.3"/>
        <path d="M14 24 L24 14 L34 24 L34 34 L14 34 Z" stroke="#3B82F6" stroke-width="2" fill="none"/>
        <rect x="20" y="26" width="8" height="8" fill="#3B82F6"/>
    </svg>`,

    trendingUp: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#D1FAE5"/>
        <path d="M12 30 L18 24 L24 28 L30 18 L36 22" stroke="#00A676" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M30 14 L36 14 L36 20" stroke="#00A676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    trendingDown: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#FEE2E2"/>
        <path d="M12 18 L18 24 L24 20 L30 30 L36 26" stroke="#DC2626" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M30 34 L36 34 L36 28" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    clock: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#FCE7F3"/>
        <circle cx="24" cy="24" r="12" stroke="#EC4899" stroke-width="2" fill="none"/>
        <path d="M24 18 L24 24 L28 28" stroke="#EC4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    pause: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#F3F4F6"/>
        <rect x="18" y="16" width="4" height="16" rx="1" fill="#6B7280"/>
        <rect x="26" y="16" width="4" height="16" rx="1" fill="#6B7280"/>
    </svg>`,

    bank: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="#EFF6FF"/>
        <path d="M12 20 L24 12 L36 20" stroke="#3B82F6" stroke-width="2" fill="none"/>
        <rect x="14" y="20" width="4" height="12" fill="#3B82F6"/>
        <rect x="22" y="20" width="4" height="12" fill="#3B82F6"/>
        <rect x="30" y="20" width="4" height="12" fill="#3B82F6"/>
        <rect x="12" y="32" width="24" height="3" fill="#3B82F6"/>
    </svg>`
};

function replaceEmojisInFile(filePath) {
    console.log(`\n📝 Processing: ${path.basename(filePath)}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let replacementCount = 0;

    // Replace each emoji with its SVG counterpart
    for (const [emoji, iconName] of Object.entries(emojiToIcon)) {
        if (content.includes(emoji)) {
            const svg = svgIcons[iconName] || svgIcons.target;
            // Replace emoji in div class="intro-card-icon" and div class="mistake-icon"
            const regex = new RegExp(`(<div class="(?:intro-card-icon|mistake-icon)">)${emoji}(</div>)`, 'g');
            const beforeCount = (content.match(regex) || []).length;
            content = content.replace(regex, `$1${svg}$2`);
            if (beforeCount > 0) {
                replacementCount += beforeCount;
                console.log(`   ✓ Replaced ${beforeCount} instance(s) of ${emoji} with ${iconName} SVG`);
            }
        }
    }

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
    .filter(file => file.match(/pillar\d+-lesson\d+\.html/));

console.log(`\n🔄 Found ${lessonFiles.length} lesson files to process\n`);

let totalReplacements = 0;
lessonFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    totalReplacements += replaceEmojisInFile(filePath);
});

console.log(`\n✅ Complete! Total replacements across all files: ${totalReplacements}\n`);
