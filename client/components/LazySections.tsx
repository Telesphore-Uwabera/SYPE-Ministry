import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { checkIsBot } from '@/lib/utils/botDetection';

// Import components directly for bot rendering to bypass lazy loading
import LatestNewsCardsSync from './LatestNewsCards';
import LatestDevotionsCardsSync from './LatestDevotionsCards';
import LatestEventsCardsSync from './LatestEventsCards';
import LatestVideosCardsSync from './LatestVideosCards';

// Lazy load heavy components (except YouTube videos)
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

// YouTube videos - NO LAZY LOADING for immediate previews
import LatestVideosCards from './LatestVideosCards';

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

// Wrapper for lazy loaded sections with preloading (YouTube videos load immediately)
export function LazySection({ 
  component, 
  title, 
  fallback 
}: { 
  component: string;
  title: string;
  fallback?: React.ReactNode;
}) {
  // Preload lazy components immediately
  React.useEffect(() => {
    switch (component) {
      case 'LatestNewsCards':
        import('./LatestNewsCards');
        break;
      case 'LatestDevotionsCards':
        import('./LatestDevotionsCards');
        break;
      case 'LatestEventsCards':
        import('./LatestEventsCards');
        break;
      // YouTube videos are not lazy loaded - no preloading needed
    }
  }, [component]);

  const isBot = checkIsBot();

  const renderComponent = () => {
    if (isBot) {
      switch (component) {
        case 'LatestNewsCards':
          return <LatestNewsCardsSync />;
        case 'LatestDevotionsCards':
          return <LatestDevotionsCardsSync />;
        case 'LatestVideosCards':
          return <LatestVideosCardsSync />;
        case 'LatestEventsCards':
          return <LatestEventsCardsSync />;
        default:
          return <div>Unknown component: {component}</div>;
      }
    }

    switch (component) {
      case 'LatestNewsCards':
        return <LazyLatestNewsCards />;
      case 'LatestDevotionsCards':
        return <LazyLatestDevotionsCards />;
      case 'LatestVideosCards':
        // YouTube videos - render immediately without lazy loading
        return <LatestVideosCardsSync />;
      case 'LatestEventsCards':
        return <LazyLatestEventsCards />;
      default:
        return <div>Unknown component: {component}</div>;
    }
  };

  // YouTube videos don't need Suspense since they're not lazy loaded
  if (component === 'LatestVideosCards' || isBot) {
    return renderComponent();
  }

  return (
    <Suspense fallback={fallback || <SectionLoading title={title} />}>
      {renderComponent()}
    </Suspense>
  );
}

export {
  LazyLatestNewsCards,
  LazyLatestDevotionsCards,
  LazyLatestEventsCards,
};
