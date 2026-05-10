export const checkIsBot = () => {
  if (typeof window === "undefined") return false;
  
  const userAgent = navigator.userAgent || "";
  // More comprehensive regex for bots, specifically targeting Netlify and Headless browsers
  const isBotUA = /Netlify|Headless|Lighthouse|bot|crawler|spider|robot|crawling|prerender|googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|slackbot|W3C_Validator/i.test(userAgent);
  
  // navigator.webdriver is true for most headless/automated browsers
  const isWebdriver = !!window.navigator.webdriver;
  
  // Netlify context markers
  const isNetlifyContext = window.location.search.includes("netlify") || 
                           window.location.hostname.includes("netlify.app");
                             
  return isBotUA || isWebdriver || isNetlifyContext || !window.sessionStorage;
};

