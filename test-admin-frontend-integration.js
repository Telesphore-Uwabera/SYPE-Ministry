// Test script to verify admin functionalities are displayed on frontend
// Run with: node test-admin-frontend-integration.js

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, endpoint, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (response.ok) {
      log(`✅ ${name}: OK`, "green");
      return { success: true, data };
    } else {
      log(`❌ ${name}: Failed - ${data.error || response.statusText}`, "red");
      return { success: false, error: data.error || response.statusText };
    }
  } catch (error) {
    log(`❌ ${name}: Error - ${error.message}`, "red");
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log("\n🧪 Testing Admin to Frontend Integration\n", "cyan");
  log("=" .repeat(60), "cyan");

  const results = {
    admin: {},
    frontend: {},
  };

  // Test Admin Endpoints
  log("\n📊 Testing Admin Endpoints\n", "blue");
  
  // Analytics
  results.admin.analytics = await testEndpoint(
    "Admin Analytics",
    "/api/admin/analytics"
  );

  // News
  results.admin.news = await testEndpoint(
    "Admin News (List)",
    "/api/admin/news"
  );

  // Projects
  results.admin.projects = await testEndpoint(
    "Admin Projects (List)",
    "/api/admin/projects"
  );

  // Events
  results.admin.events = await testEndpoint(
    "Admin Events (List)",
    "/api/admin/events"
  );

  // Donations
  results.admin.donations = await testEndpoint(
    "Admin Donations (List)",
    "/api/admin/donations"
  );

  // FAQs
  results.admin.faqs = await testEndpoint(
    "Admin FAQs (List)",
    "/api/admin/faqs"
  );

  // Books
  results.admin.books = await testEndpoint(
    "Admin Books (List)",
    "/api/admin/books"
  );

  // Devotions
  results.admin.devotions = await testEndpoint(
    "Admin Devotions (List)",
    "/api/admin/devotions"
  );

  // Committee
  results.admin.committee = await testEndpoint(
    "Admin Committee (List)",
    "/api/admin/committee"
  );

  // Contact Submissions
  results.admin.contact = await testEndpoint(
    "Admin Contact Submissions (List)",
    "/api/admin/contact"
  );

  // Members
  results.admin.members = await testEndpoint(
    "Admin Members (List)",
    "/api/admin/members"
  );

  // Test Frontend Endpoints (Public APIs)
  log("\n🌐 Testing Frontend Endpoints\n", "blue");

  // Home Page - Latest News
  results.frontend.homeNews = await testEndpoint(
    "Home - Latest News",
    "/api/admin/news?limit=3"
  );

  // Home Page - Latest Devotions
  results.frontend.homeDevotions = await testEndpoint(
    "Home - Latest Devotions",
    "/api/devotions?days=7"
  );

  // Home Page - Latest Videos
  results.frontend.homeVideos = await testEndpoint(
    "Home - Latest YouTube Videos",
    "/api/youtube/latest?limit=3"
  );

  // News Page
  results.frontend.news = await testEndpoint(
    "News Page - All News",
    "/api/admin/news"
  );

  // Devotions Page - Posters
  results.frontend.devotionsPosters = await testEndpoint(
    "Devotions Page - Posters",
    "/api/admin/media?category=devotions,posters&type=image"
  );

  // Library Page - Books
  results.frontend.library = await testEndpoint(
    "Library Page - Books",
    "/api/admin/books"
  );

  // Projects Page
  results.frontend.projects = await testEndpoint(
    "Projects Page - All Projects",
    "/api/admin/projects"
  );

  // About Page - Committee
  results.frontend.aboutCommittee = await testEndpoint(
    "About Page - Committee Members",
    "/api/committee?active=true"
  );

  // Videos Page
  results.frontend.videos = await testEndpoint(
    "Videos Page - Latest Videos",
    "/api/youtube/latest?limit=6"
  );

  // Contact Form
  results.frontend.contact = await testEndpoint(
    "Contact Form Submission",
    "/api/contact",
    "POST",
    {
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "This is a test message",
    }
  );

  // Summary
  log("\n📋 Test Summary\n", "cyan");
  log("=" .repeat(60), "cyan");

  const adminPassed = Object.values(results.admin).filter((r) => r.success).length;
  const adminTotal = Object.keys(results.admin).length;
  const frontendPassed = Object.values(results.frontend).filter((r) => r.success).length;
  const frontendTotal = Object.keys(results.frontend).length;

  log(`\nAdmin Endpoints: ${adminPassed}/${adminTotal} passed`, adminPassed === adminTotal ? "green" : "yellow");
  log(`Frontend Endpoints: ${frontendPassed}/${frontendTotal} passed`, frontendPassed === frontendTotal ? "green" : "yellow");

  // Detailed Results
  log("\n📊 Detailed Results:\n", "blue");

  log("Admin Endpoints:", "cyan");
  Object.entries(results.admin).forEach(([key, result]) => {
    const status = result.success ? "✅" : "❌";
    log(`  ${status} ${key}`, result.success ? "green" : "red");
  });

  log("\nFrontend Endpoints:", "cyan");
  Object.entries(results.frontend).forEach(([key, result]) => {
    const status = result.success ? "✅" : "❌";
    log(`  ${status} ${key}`, result.success ? "green" : "red");
  });

  // Data Flow Verification
  log("\n🔄 Data Flow Verification:\n", "blue");

  // Check if admin data appears in frontend
  if (results.admin.news.success && results.frontend.news.success) {
    const adminNewsCount = Array.isArray(results.admin.news.data) ? results.admin.news.data.length : 0;
    const frontendNewsCount = Array.isArray(results.frontend.news.data) ? results.frontend.news.data.length : 0;
    if (adminNewsCount === frontendNewsCount) {
      log(`✅ News: Admin (${adminNewsCount}) → Frontend (${frontendNewsCount})`, "green");
    } else {
      log(`⚠️  News: Admin (${adminNewsCount}) → Frontend (${frontendNewsCount}) - Count mismatch`, "yellow");
    }
  }

  if (results.admin.books.success && results.frontend.library.success) {
    const adminBooksCount = Array.isArray(results.admin.books.data) ? results.admin.books.data.length : 0;
    const frontendBooksCount = Array.isArray(results.frontend.library.data) ? results.frontend.library.data.length : 0;
    if (adminBooksCount === frontendBooksCount) {
      log(`✅ Books: Admin (${adminBooksCount}) → Frontend (${frontendBooksCount})`, "green");
    } else {
      log(`⚠️  Books: Admin (${adminBooksCount}) → Frontend (${frontendBooksCount}) - Count mismatch`, "yellow");
    }
  }

  if (results.admin.projects.success && results.frontend.projects.success) {
    const adminProjectsCount = Array.isArray(results.admin.projects.data) ? results.admin.projects.data.length : 0;
    const frontendProjectsCount = Array.isArray(results.frontend.projects.data) ? results.frontend.projects.data.length : 0;
    if (adminProjectsCount === frontendProjectsCount) {
      log(`✅ Projects: Admin (${adminProjectsCount}) → Frontend (${frontendProjectsCount})`, "green");
    } else {
      log(`⚠️  Projects: Admin (${adminProjectsCount}) → Frontend (${frontendProjectsCount}) - Count mismatch`, "yellow");
    }
  }

  if (results.admin.devotions.success && results.frontend.homeDevotions.success) {
    const adminDevotionsCount = Array.isArray(results.admin.devotions.data) ? results.admin.devotions.data.length : 0;
    const frontendDevotionsCount = Array.isArray(results.frontend.homeDevotions.data) ? results.frontend.homeDevotions.data.length : 0;
    log(`ℹ️  Devotions: Admin (${adminDevotionsCount}) → Frontend (${frontendDevotionsCount})`, "cyan");
  }

  if (results.admin.committee.success && results.frontend.aboutCommittee.success) {
    const adminCommitteeCount = Array.isArray(results.admin.committee.data) ? results.admin.committee.data.length : 0;
    const frontendCommitteeCount = Array.isArray(results.frontend.aboutCommittee.data) ? results.frontend.aboutCommittee.data.length : 0;
    log(`ℹ️  Committee: Admin (${adminCommitteeCount}) → Frontend (${frontendCommitteeCount})`, "cyan");
  }

  log("\n✨ Testing Complete!\n", "green");
}

// Run tests
runTests().catch(console.error);
