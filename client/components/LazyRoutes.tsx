import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy loaded components with error boundaries
const LazyHome = lazy(() => import('../pages/Home').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Home", description: "Home page loading failed" })
  }))
));

const LazyAbout = lazy(() => import('../pages/About').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "About", description: "About page loading failed" })
  }))
));

const LazyMembership = lazy(() => import('../pages/Membership').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Membership", description: "Membership page loading failed" })
  }))
));

const LazyDonations = lazy(() => import('../pages/Donations').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Donations", description: "Donations page loading failed" })
  }))
));

const LazyLibrary = lazy(() => import('../pages/Library').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Library", description: "Library page loading failed" })
  }))
));

const LazyNews = lazy(() => import('../pages/News').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "News", description: "News page loading failed" })
  }))
));

const LazyNewsArticle = lazy(() => import('../pages/NewsArticle').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "News Article", description: "News article loading failed" })
  }))
));

const LazyDevotions = lazy(() => import('../pages/Devotions').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Devotions", description: "Devotions page loading failed" })
  }))
));

const LazyDevotionDetail = lazy(() => import('../pages/DevotionDetail').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Devotion Detail", description: "Devotion detail loading failed" })
  }))
));

const LazyEventDetail = lazy(() => import('../pages/EventDetail').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Event Detail", description: "Event detail loading failed" })
  }))
));

const LazyVideos = lazy(() => import('../pages/Videos').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Videos", description: "Videos page loading failed" })
  }))
));

const LazyDepartments = lazy(() => import('../pages/Departments').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Departments", description: "Departments page loading failed" })
  }))
));

const LazyProjects = lazy(() => import('../pages/Projects').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Projects", description: "Projects page loading failed" })
  }))
));

const LazyContact = lazy(() => import('../pages/Contact').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Contact", description: "Contact page loading failed" })
  }))
));

const LazyTerms = lazy(() => import('../pages/Terms').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Terms", description: "Terms page loading failed" })
  }))
));

const LazyPrivacy = lazy(() => import('../pages/Privacy').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Privacy", description: "Privacy page loading failed" })
  }))
));

const LazyCookies = lazy(() => import('../pages/Cookies').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Cookies", description: "Cookies page loading failed" })
  }))
));

const LazyFAQs = lazy(() => import('../pages/FAQs').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "FAQs", description: "FAQs page loading failed" })
  }))
));

const LazyAdmin = lazy(() => import('../pages/Admin').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Admin", description: "Admin page loading failed" })
  }))
));

const LazyNotFound = lazy(() => import('../pages/NotFound').catch(() => 
  import('../components/PagePlaceholder').then(module => ({ 
    default: () => module.default({ title: "Not Found", description: "Page not found" })
  }))
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
