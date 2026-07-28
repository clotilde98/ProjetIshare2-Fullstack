import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export const saveImage = async (imageBuffer, imageName, destFolder) => {
    // The directory is not tracked by Git when it is empty and may therefore be
    // absent in a fresh Docker image. Create it before asking Sharp to write.
    await fs.mkdir(destFolder, { recursive: true });

    return sharp(imageBuffer)
        .jpeg()
        .resize({
            fit: 'inside',
            width: 1920,
            height: 1080
        })
        .toFile(path.join(destFolder, `${imageName}.jpeg`));
}
