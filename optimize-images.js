import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

async function convertImages() {
  const inputDir = './src/assets/images';
  const outputDir = './opti';

  try {
    // Создаём папку opti в корне, если она не существует
    await fs.mkdir(outputDir, { recursive: true });

    // Рекурсивно собираем все файлы из входной папки
    async function getAllFiles(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      let files = [];
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files = [...files, ...(await getAllFiles(fullPath))];
        } else {
          files.push(fullPath);
        }
      }
      return files;
    }

    const files = await getAllFiles(inputDir);

    // Обрабатываем только JPG и PNG файлы
    for (const file of files) {
      if (file.match(/\.(jpe?g|png)$/i)) {
        const relativePath = path.relative(inputDir, file);
        const baseName = path.basename(file, path.extname(file));
        const outputSubDir = path.join(outputDir, path.dirname(relativePath));
        const outputJpgPngPath = path.join(outputSubDir, `${baseName}${path.extname(file)}`);
        const webpPath = path.join(outputSubDir, `${baseName}.webp`);
        const avifPath = path.join(outputSubDir, `${baseName}.avif`);

        // Создаём подпапку в opti, если она не существует
        await fs.mkdir(outputSubDir, { recursive: true });

        // Оптимизируем исходное изображение (JPG или PNG)
        if (file.match(/\.jpe?g$/i)) {
          await sharp(file).jpeg({ quality: 85, mozjpeg: true, progressive: true }).toFile(outputJpgPngPath);
          console.log(`Optimized JPG: ${outputJpgPngPath}`);
        } else if (file.match(/\.png$/i)) {
          await sharp(file).png({ quality: 80, compressionLevel: 9, palette: true }).toFile(outputJpgPngPath);
          console.log(`Optimized PNG: ${outputJpgPngPath}`);
        }

        // Создаём WebP
        await sharp(file).webp({ quality: 85, effort: 6 }).toFile(webpPath);
        console.log(`Created WebP: ${webpPath}`);

        // Создаём AVIF
        await sharp(file).avif({ quality: 65, effort: 6 }).toFile(avifPath);
        console.log(`Created AVIF: ${avifPath}`);
      }
    }
    console.log('All images обработаны успешно!');
  } catch (err) {
    console.error('Ошибка при обработке изображений:', err);
  }
}

convertImages();
