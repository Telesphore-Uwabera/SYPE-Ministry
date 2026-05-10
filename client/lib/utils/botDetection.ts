export const checkIsBot = () => {
  if (typeof window === "undefined") return false;
  
  const userAgent = navigator.userAgent || "";
  const isBot = /Netlify|HeadlessChrome|Chrome-Lighthouse|prerender|googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|slackbot|vkShare|W3C_Validator/i.test(userAgent);
  
  const isNetlifyThumbnail = window.location.search.includes("netlify") || 
                             window.location.hostname.includes("netlify.app");
                             
  return isBot || isNetlifyThumbnail || !window.sessionStorage;
};
