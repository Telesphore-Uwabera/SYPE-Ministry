import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
const LazyLatestNewsCards = lazy(() => 
  import('./LatestNewsCards').catch(() => 
    import('./PagePlaceholder')
  )
);

const LazyLatestDevotionsCards = lazy(() => 
  import('./LatestDevotionsCards').catch(() => 
    import('./PagePlaceholder')
  )
);

const LazyLatestVideosCards = lazy(() => 
  import('./LatestVideosCards').catch(() => 
    import('./PagePlaceholder')
  )
);

const LazyLatestEventsCards = lazy(() => 
  import('./LatestEventsCards').catch(() => 
    import('./PagePlaceholder')
  )
);

// Loading component
const SectionLoading = ({ title }: { title: string }) => (
  <div className="py-8">
    <h2 className="font-heading font-bold text-2xl text-primary mb-6">{title}</h2>
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading {title.toLowerCase()}...</p>
      </div>
    </div>
  </div>
);

// Wrapper for lazy loaded sections
export function LazySection({ 
  component, 
  title, 
  fallback 
}: { 
  component: string;
  title: string;
  fallback?: React.ReactNode;
}) {
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
