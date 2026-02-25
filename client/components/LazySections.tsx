import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components with preloading
const LazyLatestNewsCards = lazy(() => 
  import('./LatestNewsCards').catch(() => 
    import('./PagePlaceholder').then(module => ({ 
      default: () => module.default({ title: "Latest News", description: "Loading news content..." })
    }))
  )
);

const LazyLatestDevotionsCards = lazy(() => 
  import('./LatestDevotionsCards').catch(() => 
    import('./PagePlaceholder').then(module => ({ 
      default: () => module.default({ title: "Latest Devotions", description: "Loading devotion content..." })
    }))
  )
);

const LazyLatestVideosCards = lazy(() => 
  import('./LatestVideosCards').catch(() => 
    import('./PagePlaceholder').then(module => ({ 
      default: () => module.default({ title: "Latest Videos", description: "Loading video content..." })
    }))
  )
);

const LazyLatestEventsCards = lazy(() => 
  import('./LatestEventsCards').catch(() => 
    import('./PagePlaceholder').then(module => ({ 
      default: () => module.default({ title: "Latest Events", description: "Loading event content..." })
    }))
  )
);

// Loading component with better fallback content
const SectionLoading = ({ title }: { title: string }) => (
  <div className="py-8">
    <h2 className="font-heading font-bold text-2xl text-primary mb-6">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 bg-muted/50 rounded-lg animate-pulse border border-border">
          <div className="p-6">
            <div className="h-4 bg-muted rounded mb-3 w-3/4"></div>
            <div className="h-3 bg-muted rounded mb-2 w-1/2"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Wrapper for lazy loaded sections with preloading
export function LazySection({ 
  component, 
  title, 
  fallback 
}: { 
  component: string;
  title: string;
  fallback?: React.ReactNode;
}) {
  // Preload components immediately
  React.useEffect(() => {
    switch (component) {
      case 'LatestNewsCards':
        import('./LatestNewsCards');
        break;
      case 'LatestDevotionsCards':
        import('./LatestDevotionsCards');
        break;
      case 'LatestVideosCards':
        import('./LatestVideosCards');
        break;
      case 'LatestEventsCards':
        import('./LatestEventsCards');
        break;
    }
  }, [component]);

  const renderComponent = () => {
    switch (component) {
      case 'LatestNewsCards':
        return <LazyLatestNewsCards />;
      case 'LatestDevotionsCards':
        return <LazyLatestDevotionsCards />;
      case 'LatestVideosCards':
        return <LazyLatestVideosCards />;
      case 'LatestEventsCards':
        return <LazyLatestEventsCards />;
      default:
        return <div>Unknown component: {component}</div>;
    }
  };

  return (
    <Suspense fallback={fallback || <SectionLoading title={title} />}>
      {renderComponent()}
    </Suspense>
  );
}

export {
  LazyLatestNewsCards,
  LazyLatestDevotionsCards,
  LazyLatestVideosCards,
  LazyLatestEventsCards,
};
