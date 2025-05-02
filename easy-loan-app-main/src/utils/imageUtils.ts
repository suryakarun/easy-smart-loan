
/**
 * Utility functions for image processing and analysis
 */

export const MAX_IMAGE_DIMENSION = 1024;

/**
 * Resizes an image if it exceeds maximum dimensions
 */
export function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

/**
 * Counts pixels that match a target color within a tolerance
 */
export const countColorPixels = (imageData: ImageData, targetColor: number[]) => {
  const [r, g, b] = targetColor;
  const data = imageData.data;
  let count = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    // Allow for some variation in the color
    if (
      Math.abs(data[i] - r) < 50 &&
      Math.abs(data[i + 1] - g) < 50 &&
      Math.abs(data[i + 2] - b) < 50
    ) {
      count++;
    }
  }
  
  return count;
};
