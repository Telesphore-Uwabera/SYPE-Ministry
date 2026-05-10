export const checkIsBot = () => {
  if (typeof window === "undefined") return false;
  
  const userAgent = navigator.userAgent || "";
  // Added Lighthouse and generic bot/headless/crawler terms
  const isBot = /Netlify|HeadlessChrome|Chrome-Lighthouse|Lighthouse|bot|crawler|spider|robot|crawling|prerender|googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|slackbot|vkShare|W3C_Validator/i.test(userAgent);
  
  const isNetlifyThumbnail = window.location.search.includes("netlify") || 
                             window.location.hostname.includes("netlify.app") ||
                             window.location.hostname.includes("sypeministry.org"); // Include production domain for screenshot bot
                             
  return isBot || isNetlifyThumbnail || !window.sessionStorage;
};
