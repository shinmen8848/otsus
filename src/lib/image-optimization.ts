// Advanced Image Optimization Utilities
export interface ImageOptimizationOptions {
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  quality?: number; // 0.0 to 1.0
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  progressive?: boolean;
  lossless?: boolean;
}

export interface OptimizedImageResult {
  blob: Blob;
  url: string;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export class ImageOptimizer {
  private static canvas: HTMLCanvasElement | null = null;
  private static ctx: CanvasRenderingContext2D | null = null;

  private static getCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    if (!this.canvas || !this.ctx) {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        throw new Error('Canvas 2D context not available');
      }
    }
    return { canvas: this.canvas, ctx: this.ctx };
  }

  /**
   * Optimize an image file with advanced compression and format conversion
   */
  public static async optimizeImage(
    file: File | ImageData | HTMLImageElement,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImageResult> {
    const {
      format = 'webp',
      quality = 0.85,
      width,
      height,
      maintainAspectRatio = true,
      progressive = true,
      lossless = false
    } = options;

    let sourceImage: HTMLImageElement;
    let originalSize: number;

    // Convert input to HTMLImageElement
    if (file instanceof File) {
      originalSize = file.size;
      sourceImage = await this.fileToImage(file);
    } else if (file instanceof ImageData) {
      originalSize = file.data.length;
      sourceImage = await this.imageDataToImage(file);
    } else {
      originalSize = 0; // Unknown for HTMLImageElement
      sourceImage = file;
    }

    // Calculate target dimensions
    const targetDimensions = this.calculateDimensions(
      sourceImage.width,
      sourceImage.height,
      width,
      height,
      maintainAspectRatio
    );

    // Create optimized image
    const { canvas, ctx } = this.getCanvas();
    canvas.width = targetDimensions.width;
    canvas.height = targetDimensions.height;

    // Apply high-quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw and resize image
    ctx.drawImage(sourceImage, 0, 0, targetDimensions.width, targetDimensions.height);

    // Convert to optimized format
    const mimeType = this.getMimeType(format);
    const actualQuality = lossless ? 1.0 : quality;
    
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        mimeType,
        actualQuality
      );
    });

    const url = URL.createObjectURL(blob);
    const compressionRatio = originalSize > 0 ? (originalSize - blob.size) / originalSize : 0;

    return {
      blob,
      url,
      originalSize,
      optimizedSize: blob.size,
      compressionRatio,
      format,
      dimensions: targetDimensions
    };
  }

  /**
   * Create multiple optimized versions for responsive images
   */
  public static async createResponsiveImages(
    file: File | ImageData | HTMLImageElement,
    breakpoints: number[] = [640, 768, 1024, 1280, 1920],
    options: Omit<ImageOptimizationOptions, 'width'> = {}
  ): Promise<Array<OptimizedImageResult & { breakpoint: number }>> {
    const results: Array<OptimizedImageResult & { breakpoint: number }> = [];

    for (const breakpoint of breakpoints) {
      try {
        const result = await this.optimizeImage(file, {
          ...options,
          width: breakpoint
        });
        results.push({ ...result, breakpoint });
      } catch (error) {
        console.warn(`Failed to create image for breakpoint ${breakpoint}:`, error);
      }
    }

    return results;
  }

  /**
   * Generate a low-quality placeholder image
   */
  public static async generatePlaceholder(
    file: File | ImageData | HTMLImageElement,
    size: number = 32
  ): Promise<string> {
    const result = await this.optimizeImage(file, {
      width: size,
      height: size,
      quality: 0.1,
      format: 'jpeg'
    });

    // Convert to base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(result.blob);
    });
  }

  /**
   * Check if a format is supported by the browser
   */
  public static async supportsFormat(format: string): Promise<boolean> {
    const { canvas } = this.getCanvas();
    const mimeType = this.getMimeType(format);
    
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob !== null),
        mimeType,
        0.5
      );
    });
  }

  /**
   * Get the best supported format for the browser
   */
  public static async getBestFormat(): Promise<'avif' | 'webp' | 'jpeg'> {
    const formats: Array<'avif' | 'webp' | 'jpeg'> = ['avif', 'webp', 'jpeg'];
    
    for (const format of formats) {
      if (await this.supportsFormat(format)) {
        return format;
      }
    }
    
    return 'jpeg'; // Fallback
  }

  /**
   * Batch optimize multiple images
   */
  public static async batchOptimize(
    files: File[],
    options: ImageOptimizationOptions = {},
    onProgress?: (completed: number, total: number) => void
  ): Promise<OptimizedImageResult[]> {
    const results: OptimizedImageResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.optimizeImage(files[i], options);
        results.push(result);
        onProgress?.(i + 1, files.length);
      } catch (error) {
        console.error(`Failed to optimize image ${files[i].name}:`, error);
      }
    }
    
    return results;
  }

  // Private helper methods
  private static async fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private static async imageDataToImage(imageData: ImageData): Promise<HTMLImageElement> {
    const { canvas, ctx } = this.getCanvas();
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = canvas.toDataURL();
    });
  }

  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    targetWidth?: number,
    targetHeight?: number,
    maintainAspectRatio: boolean = true
  ): { width: number; height: number } {
    if (!targetWidth && !targetHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    if (!maintainAspectRatio) {
      return {
        width: targetWidth || originalWidth,
        height: targetHeight || originalHeight
      };
    }

    const aspectRatio = originalWidth / originalHeight;

    if (targetWidth && targetHeight) {
      // Both dimensions specified - choose the one that maintains aspect ratio
      const widthBasedHeight = targetWidth / aspectRatio;
      const heightBasedWidth = targetHeight * aspectRatio;

      if (widthBasedHeight <= targetHeight) {
        return { width: targetWidth, height: widthBasedHeight };
      } else {
        return { width: heightBasedWidth, height: targetHeight };
      }
    }

    if (targetWidth) {
      return { width: targetWidth, height: targetWidth / aspectRatio };
    }

    if (targetHeight) {
      return { width: targetHeight * aspectRatio, height: targetHeight };
    }

    return { width: originalWidth, height: originalHeight };
  }

  private static getMimeType(format: string): string {
    switch (format) {
      case 'webp': return 'image/webp';
      case 'avif': return 'image/avif';
      case 'png': return 'image/png';
      case 'jpeg': return 'image/jpeg';
      default: return 'image/jpeg';
    }
  }

  /**
   * Clean up created object URLs to prevent memory leaks
   */
  public static cleanup(urls: string[]): void {
    urls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  }
}
