// Script to diagnose lesson progress issues
// Usage: node diagnose-progress.js <email>

const db = require('./database');

async function diagnoseProgress(email) {
    try {
        console.log(`\n🔍 Diagnosing lesson progress for: ${email}\n`);

        // Get user
        const user = await db.getUserByEmail(email);
        if (!user) {
            console.error(`❌ User not found: ${email}`);
            process.exit(1);
        }

        console.log(`✅ Found user: ${user.name} (ID: ${user.id})`);
        console.log(`   Tier: ${user.membership_tier}`);

        // Get current progress
        const progress = await db.getUserProgress(user.id);
        console.log(`\n📊 Total progress records: ${progress.length}\n`);

        if (progress.length === 0) {
            console.log('✅ No progress records found - database is clean!\n');
            process.exit(0);
        }

        // Organize by pillar
        const byPillar = {
            1: [], 2: [], 3: [], 4: []
        };

        progress.forEach(p => {
            if (!p.completed) return;

            const lessonId = p.lesson_id;

            // Match pillar patterns
            const match = lessonId.match(/pillar(\d+)_lesson(\d+)/);
            if (match) {
                const pillarNum = parseInt(match[1]);
                const lessonNum = parseInt(match[2]);
                if (byPillar[pillarNum]) {
                    byPillar[pillarNum].push({
                        lesson: lessonNum,
                        id: lessonId,
                        completedAt: p.completed_at
                    });
                }
            }

            // Legacy format for pillar 1
            const legacyMatch = lessonId.match(/^lesson(\d+)$/);
            if (legacyMatch) {
                const lessonNum = parseInt(legacyMatch[1]);
                byPillar[1].push({
                    lesson: lessonNum,
                    id: lessonId,
                    completedAt: p.completed_at
                });
            }
        });

        // Display by pillar
        for (let pillar = 1; pillar <= 4; pillar++) {
            console.log(`\n📚 PILLAR ${pillar}:`);
            if (byPillar[pillar].length === 0) {
                console.log('   No lessons completed');
            } else {
                byPillar[pillar].sort((a, b) => a.lesson - b.lesson);
                byPillar[pillar].forEach(item => {
                    console.log(`   ✓ Lesson ${item.lesson} (${item.id}) - ${item.completedAt}`);
                });

                // Check for gaps
                const lessonNums = byPillar[pillar].map(i => i.lesson);
                const maxLesson = Math.max(...lessonNums);
                for (let i = 1; i <= maxLesson; i++) {
                    if (!lessonNums.includes(i)) {
                        console.log(`   ⚠️  GAP: Lesson ${i} missing (but lesson ${maxLesson} completed)`);
                    }
                }
            }
        }

        console.log('\n');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
    console.error('\n❌ Usage: node diagnose-progress.js <email>\n');
    console.error('Example: node diagnose-progress.js user@example.com\n');
    process.exit(1);
}

// Run the diagnosis
diagnoseProgress(email);
