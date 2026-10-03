/**
 * Client-side image compression and conversion to WebP format.
 * Works seamlessly across Mobile (iOS/Android camera/gallery) and Desktop browsers.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
}

export async function compressAndConvertToWebP(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const { maxWidth = 2048, maxHeight = 2048, quality = 0.85 } = options;

  return new Promise((resolve, reject) => {
    // If browser doesn't support canvas or FileReader, return original
    if (typeof window === 'undefined' || !window.FileReader) {
      return resolve(file);
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }

            const cleanBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFileName = `${cleanBaseName}.webp`;

            const convertedFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            console.log(
              `[Auto-compress] Original: ${(file.size / 1024).toFixed(1)} KB -> WebP: ${(convertedFile.size / 1024).toFixed(1)} KB (${Math.round((1 - convertedFile.size / file.size) * 100)}% savings)`
            );

            resolve(convertedFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        // Fallback to original if decoding failed
        resolve(file);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
