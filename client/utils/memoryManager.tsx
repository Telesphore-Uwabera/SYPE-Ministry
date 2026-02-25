import React, { useState, useEffect, useRef } from 'react';

// Memory monitoring and cleanup utilities

interface MemoryStats {
  used: number;
  total: number;
  percentage: number;
}

class MemoryManager {
  private cleanupCallbacks: (() => void)[] = [];
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  // Get current memory usage
  getMemoryUsage(): MemoryStats | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      };
    }
    return null;
  }

  // Start memory monitoring
  startMonitoring(intervalMs: number = 5000) {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      const stats = this.getMemoryUsage();
      if (stats && stats.percentage > 80) {
        console.warn(`High memory usage detected: ${stats.percentage}% (${stats.used}MB)`);
        this.performCleanup();
      }
    }, intervalMs);
  }

  // Stop memory monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
  }

  // Register cleanup callback
  registerCleanup(callback: () => void) {
    this.cleanupCallbacks.push(callback);
  }

  // Perform cleanup
  performCleanup() {
    // Run all registered cleanup callbacks
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Cleanup callback failed:', error);
      }
    });

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  // Clear all caches and reset state
  clearCaches() {
    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }
}

// React hook for memory management
export function useMemoryManagement() {
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);

  useEffect(() => {
    const memoryManager = new MemoryManager();
    
    const updateMemoryStats = () => {
      const stats = memoryManager.getMemoryUsage();
      setMemoryStats(stats);
    };

    // Update stats every 2 seconds
    const interval = setInterval(updateMemoryStats, 2000);
    updateMemoryStats(); // Initial update

    return () => {
      clearInterval(interval);
      memoryManager.stopMonitoring();
    };
  }, []);

  return memoryStats;
}

// Lazy image component with memory optimization
export function LazyImage({ 
  src, 
  alt, 
  className, 
  placeholder,
  ...props 
}: {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  [key: string]: any;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          style={{ opacity: isLoaded ? 1 : 0 }}
          className={`transition-opacity duration-300 ${className}`}
          {...props}
        />
      )}
    </div>
  );
}

export default MemoryManager;
