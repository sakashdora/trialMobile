import { useState, useEffect, useRef, useCallback } from 'react';

export interface ImageSequenceOptions {
  urls: string[];
  onProgress?: (loaded: number, total: number) => void;
}

export interface ImageSequenceReturn {
  images: HTMLImageElement[];
  isLoaded: boolean;
  progress: number;
  drawFrame: (
    ctx: CanvasRenderingContext2D,
    frameIndex: number,
    width: number,
    height: number,
  ) => void;
}

/**
 * Custom React hook for preloading and high-performance canvas blitting
 * of numbered image sequences (such as 360 turntables and exploded views).
 */
export function useImageSequence(options: ImageSequenceOptions): ImageSequenceReturn {
  const { urls, onProgress } = options;
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    if (!urls || urls.length === 0) {
      setImages([]);
      setIsLoaded(true);
      setProgress(100);
      return;
    }

    let isCancelled = false;
    let loadedCount = 0;
    const total = urls.length;
    const imageList: HTMLImageElement[] = new Array(total);

    setIsLoaded(false);
    setProgress(0);

    urls.forEach((url, index) => {
      const img = new Image();
      img.src = url;

      const handleImageLoad = () => {
        if (isCancelled) return;
        loadedCount += 1;
        const currentProgress = Math.round((loadedCount / total) * 100);
        setProgress(currentProgress);
        if (onProgressRef.current) {
          onProgressRef.current(loadedCount, total);
        }
        if (loadedCount === total) {
          imagesRef.current = imageList;
          setImages(imageList);
          setIsLoaded(true);
        }
      };

      const handleImageError = () => {
        // Even on error, increment count to avoid stalled progress
        handleImageLoad();
      };

      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      imageList[index] = img;
    });

    imagesRef.current = imageList;
    setImages(imageList);

    return () => {
      isCancelled = true;
      imageList.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [urls]);

  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, frameIndex: number, width: number, height: number): void => {
      if (!ctx || !Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0)
        return;

      const safeFrame = Number.isFinite(frameIndex) ? frameIndex : 0;

      const imageList = imagesRef.current;
      if (!imageList || imageList.length === 0) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      // Safe normalization of frame index (wrapping negative and overflow numbers)
      const normalizedIndex =
        ((Math.round(safeFrame) % imageList.length) + imageList.length) % imageList.length;

      const img = imageList[normalizedIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        // Fallback: search backwards for closest loaded frame
        for (let offset = 1; offset < imageList.length; offset++) {
          const fallbackIndex = (normalizedIndex - offset + imageList.length) % imageList.length;
          const fallbackImg = imageList[fallbackIndex];
          if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth > 0) {
            ctx.clearRect(0, 0, width, height);
            drawContained(ctx, fallbackImg, width, height);
            return;
          }
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);
      drawContained(ctx, img, width, height);
    },
    [],
  );

  return {
    images,
    isLoaded,
    progress,
    drawFrame,
  };
}

/**
 * Aspect-ratio preserving contain blitter
 */
function drawContained(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
): void {
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;
  if (imgWidth === 0 || imgHeight === 0) return;

  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth = canvasWidth;
  let drawHeight = canvasHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasRatio > imgRatio) {
    // Canvas is wider than image -> fit height, center horizontally
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * imgRatio;
    offsetX = (canvasWidth - drawWidth) / 2;
  } else {
    // Canvas is taller than image -> fit width, center vertically
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgRatio;
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}
