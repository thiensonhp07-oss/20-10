/**
 * Automatically creates transparent cutouts from isolated black-background botanical images
 * so they float cleanly over both light pastel and dark velvet backgrounds.
 */

const cache = new Map<string, string>();

export function getTransparentCutout(imageSrc: string): Promise<string> {
  if (cache.has(imageSrc)) {
    return Promise.resolve(cache.get(imageSrc)!);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Threshold: pixels where R, G, B are very low are turned transparent with feathering
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = Math.max(r, Math.max(g, b));

        if (brightness < 18) {
          // Pure black background
          data[i + 3] = 0;
        } else if (brightness < 45) {
          // Feathered smooth edge
          const alphaRatio = (brightness - 18) / (45 - 18);
          data[i + 3] = Math.round(data[i + 3] * alphaRatio);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      cache.set(imageSrc, dataUrl);
      resolve(dataUrl);
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}
