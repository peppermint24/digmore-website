import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = 'public/images';
const outputDir = 'public/images/optimized';

async function optimizeImages() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Get all jpg files
    const files = await fs.readdir(inputDir);
    const jpgFiles = files.filter(file => file.endsWith('.jpg'));

    for (const file of jpgFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace('.jpg', '.webp'));

      await sharp(inputPath)
        .webp({ quality: 80 }) // Convert to WebP with 80% quality
        .resize(1200, null, { // Resize to max width 1200px, maintain aspect ratio
          withoutEnlargement: true
        })
        .toFile(outputPath);

      console.log(`Optimized: ${file} -> ${path.basename(outputPath)}`);
    }
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages(); 