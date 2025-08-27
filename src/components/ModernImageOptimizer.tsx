import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModernImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const ModernImage: React.FC<ModernImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 75,
  format = 'webp',
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL,
  sizes,
  priority = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState('');

  // Generate optimized image URLs
  const generateSrcSet = (baseSrc: string) => {
    const sizes = [640, 768, 1024, 1280, 1920];
    return sizes.map(size => {
      const optimizedSrc = optimizeImageUrl(baseSrc, {
        width: size,
        quality,
        format
      });
      return `${optimizedSrc} ${size}w`;
    }).join(', ');
  };

  const optimizeImageUrl = (url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }) => {
    // In a real app, this would integrate with an image optimization service
    // For now, we'll return the original URL with query parameters
    const params = new URLSearchParams();
    
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('f', options.format);
    
    return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Set source when in view
  useEffect(() => {
    if (isInView && !currentSrc) {
      const optimizedSrc = optimizeImageUrl(src, {
        width,
        height,
        quality,
        format
      });
      setCurrentSrc(optimizedSrc);
    }
  }, [isInView, src, width, height, quality, format, currentSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const getPlaceholder = () => {
    if (placeholder === 'blur' && blurDataURL) {
      return blurDataURL;
    }
    
    if (placeholder === 'blur') {
      // Generate a simple blur placeholder
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f3e8ff;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#fdf2f8;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#d1d5db" font-family="system-ui" font-size="14">💕</text>
        </svg>
      `)}`;
    }

    return '';
  };

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        style={{ width, height }}
      >
        <span className="text-2xl">💔</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Placeholder */}
      {!isLoaded && placeholder !== 'empty' && (
        <motion.img
          src={getPlaceholder()}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Main image */}
      {isInView && (
        <motion.img
          src={currentSrc}
          srcSet={generateSrcSet(src)}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          className="w-full h-full object-cover"
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-2 border-pink-300 border-t-pink-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
};

// Progressive image component with multiple formats
interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false
}) => {
  const [loadedFormat, setLoadedFormat] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  const formats = ['avif', 'webp', 'jpg'];
  
  useEffect(() => {
    if (!priority) return;

    // Test format support and load the best available
    const testFormats = async () => {
      for (const format of formats) {
        if (await supportsFormat(format)) {
          setLoadedFormat(format);
          break;
        }
      }
    };

    testFormats();
  }, [priority]);

  const supportsFormat = (format: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      
      const testImages = {
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
        webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
        jpg: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
      };
      
      img.src = testImages[format as keyof typeof testImages] || testImages.jpg;
    });
  };

  return (
    <picture className={className}>
      <source srcSet={`${src}?f=avif`} type="image/avif" />
      <source srcSet={`${src}?f=webp`} type="image/webp" />
      <ModernImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={() => setIsLoaded(true)}
      />
    </picture>
  );
};

// Image gallery with virtual scrolling for performance
interface VirtualImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  itemHeight?: number;
  containerHeight?: number;
  className?: string;
}

export const VirtualImageGallery: React.FC<VirtualImageGalleryProps> = ({
  images,
  itemHeight = 200,
  containerHeight = 600,
  className = ''
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    images.length
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: images.length * itemHeight, position: 'relative' }}>
        {images.slice(visibleStart, visibleEnd).map((image, index) => {
          const actualIndex = visibleStart + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
            >
              <ModernImage
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
