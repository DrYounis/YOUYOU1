const fs = require('fs');
const path = require('path');

// Determine paths
const sourceDir = '/Volumes/Elements/YOUNIS STUDY ';
const targetAppDir = __dirname;
const assetsDir = path.join(targetAppDir, 'public', 'assets');
const legacyDir = path.join(targetAppDir, 'public', 'legacy');

// Create target directories
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
if (!fs.existsSync(legacyDir)) fs.mkdirSync(legacyDir, { recursive: true });

console.log('🚀 Starting Migration to YOUYOU1...');

try {
    const files = fs.readdirSync(sourceDir);

    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const isFile = fs.statSync(sourcePath).isFile();

        if (isFile) {
            const ext = path.extname(file).toLowerCase();
            
            // 1. Move Images and PDFs
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.pdf') {
                fs.copyFileSync(sourcePath, path.join(assetsDir, file));
                console.log(`✅ Copied asset: ${file}`);
            } 
            
            // 2. Move HTML files and update asset links!
            else if (ext === '.html') {
                let content = fs.readFileSync(sourcePath, 'utf8');
                
                // Replace any local image or pdf references (e.g. "1.png" -> "/assets/1.png")
                // Ignores absolute http urls
                content = content.replace(/['"]((?!http)[^'"]+\.(png|PNG|jpg|jpeg|pdf))['"]/g, '"/assets/$1"');
                
                fs.writeFileSync(path.join(legacyDir, file), content);
                console.log(`✅ Migrated and linked HTML: ${file}`);
            }
        }
    });

    console.log('\n🎉 Migration Script Complete!');
    console.log('All images are in public/assets/ and apps are in public/legacy/');
    console.log('You can now run: git add -A && git commit -m "refactor: unified repo" && git push');

} catch (err) {
    console.error('❌ Error during migration:', err.message);
    console.log('Make sure terminal has full disk access or drive is connected.');
}
