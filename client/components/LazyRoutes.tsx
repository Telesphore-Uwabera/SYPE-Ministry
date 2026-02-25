import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy loaded components with error boundaries
const LazyHome = lazy(() => import('../pages/Home').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyAbout = lazy(() => import('../pages/About').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyMembership = lazy(() => import('../pages/Membership').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyDonations = lazy(() => import('../pages/Donations').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyLibrary = lazy(() => import('../pages/Library').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyNews = lazy(() => import('../pages/News').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyNewsArticle = lazy(() => import('../pages/NewsArticle').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyDevotions = lazy(() => import('../pages/Devotions').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyDevotionDetail = lazy(() => import('../pages/DevotionDetail').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyEventDetail = lazy(() => import('../pages/EventDetail').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyVideos = lazy(() => import('../pages/Videos').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyDepartments = lazy(() => import('../pages/Departments').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyProjects = lazy(() => import('../pages/Projects').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyContact = lazy(() => import('../pages/Contact').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyTerms = lazy(() => import('../pages/Terms').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyPrivacy = lazy(() => import('../pages/Privacy').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyCookies = lazy(() => import('../pages/Cookies').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyFAQs = lazy(() => import('../pages/FAQs').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyAdmin = lazy(() => import('../pages/Admin').catch(() => 
  import('../components/PagePlaceholder')
));

const LazyNotFound = lazy(() => import('../pages/NotFound').catch(() => 
  import('../components/PagePlaceholder')
));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Wrapper component for lazy loading with suspense
export function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
}

// Export all lazy loaded components
export {
  LazyHome,
  LazyAbout,
  LazyMembership,
  LazyDonations,
  LazyLibrary,
  LazyNews,
  LazyNewsArticle,
  LazyDevotions,
  LazyDevotionDetail,
  LazyEventDetail,
  LazyVideos,
  LazyDepartments,
  LazyProjects,
  LazyContact,
  LazyTerms,
  LazyPrivacy,
  LazyCookies,
  LazyFAQs,
  LazyAdmin,
  LazyNotFound,
};
