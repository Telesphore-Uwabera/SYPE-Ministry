import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Trash2, RefreshCw } from 'lucide-react';

interface MemoryStats {
  used: number;
  total: number;
  percentage: number;
}

export default function MemoryMonitor() {
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const getMemoryUsage = (): MemoryStats | null => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      };
    }
    return null;
  };

  const updateMemoryStats = () => {
    const stats = getMemoryUsage();
    setMemoryStats(stats);
  };

  const clearCaches = () => {
    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear localStorage if needed
    if (localStorage.length > 100) {
      localStorage.clear();
    }
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    updateMemoryStats();
  };

  useEffect(() => {
    updateMemoryStats();
    
    if (isMonitoring) {
      const interval = setInterval(updateMemoryStats, 2000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  if (!memoryStats) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Memory Monitor
          </CardTitle>
          <CardDescription>
            Memory monitoring not available in this browser
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getMemoryColor = (percentage: number) => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMemoryBadgeVariant = (percentage: number) => {
    if (percentage < 60) return 'default';
    if (percentage < 80) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Memory Monitor
        </CardTitle>
        <CardDescription>
          Real-time memory usage tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Memory Usage</span>
            <Badge variant={getMemoryBadgeVariant(memoryStats.percentage)}>
              {memoryStats.percentage}%
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getMemoryColor(memoryStats.percentage)}`}
              style={{ width: `${memoryStats.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{memoryStats.used} MB used</span>
            <span>{memoryStats.total} MB total</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isMonitoring ? 'animate-spin' : ''}`} />
            {isMonitoring ? 'Stop' : 'Start'}
          </Button>
          <Button size="sm" variant="outline" onClick={clearCaches}>
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
        
        {memoryStats.percentage > 80 && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            ⚠️ High memory usage detected. Consider clearing caches or refreshing the page.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
