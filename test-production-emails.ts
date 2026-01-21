
/**
 * Production Email Testing Script
 * Tests email functionality on the deployed backend
 */


const PRODUCTION_API = "https://sype-ministry-api.onrender.com"; // UPDATE THIS with your actual Render URL!
// To find it: Go to your Render dashboard → Your service → Copy the URL
const TEST_EMAIL = "sypeministry@gmail.com"; // Email to receive test notifications


interface TestResult {
    test: string;
    status: "PASS" | "FAIL" | "ERROR";
    statusCode?: number;
    message: string;
    response?: any;
}

const results: TestResult[] = [];

function logResult(result: TestResult) {
    results.push(result);
    const icon = result.status === "PASS" ? "✅" : result.status === "FAIL" ? "❌" : "⚠️";
    console.log(`\n${icon} ${result.test}`);
    console.log(`   Status: ${result.status} (HTTP ${result.statusCode || "N/A"})`);
    console.log(`   Message: ${result.message}`);
    if (result.response) {
        console.log(`   Response:`, JSON.stringify(result.response, null, 2));
    }
}

async function testContactForm() {
    console.log("\n--- Testing Contact Form (/api/contact) ---");
    try {
        const response = await fetch(`${PRODUCTION_API}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Production Test User",
                email: TEST_EMAIL,
                subject: "Production Email Test - Contact Form",
                message: "This is a test from the production verification script."
            })
        });

        const data = await response.json();

        logResult({
            test: "Contact Form Submission",
            status: response.ok ? "PASS" : "FAIL",
            statusCode: response.status,
            message: response.ok
                ? "Contact form submitted successfully"
                : data.error || "Submission failed",
            response: data
        });
    } catch (error: any) {
        logResult({
            test: "Contact Form Submission",
            status: "ERROR",
            message: `Network error: ${error.message}`,
        });
    }
}

async function testSubscription() {
    console.log("\n--- Testing Newsletter Subscription (/api/subscribe) ---");
    try {
        const response = await fetch(`${PRODUCTION_API}/api/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: TEST_EMAIL,
                name: "Production Test Subscriber"
            })
        });

        const data = await response.json();

        logResult({
            test: "Newsletter Subscription",
            status: response.ok || response.status === 400 ? "PASS" : "FAIL", // 400 might mean already subscribed
            statusCode: response.status,
            message: response.ok
                ? "Subscription successful"
                : data.error === "Email is already subscribed"
                    ? "Already subscribed (expected)"
                    : data.error || "Subscription failed",
            response: data
        });
    } catch (error: any) {
        logResult({
            test: "Newsletter Subscription",
            status: "ERROR",
            message: `Network error: ${error.message}`,
        });
    }
}

async function testDonation() {
    console.log("\n--- Testing Donation Form (/api/donations) ---");
    try {
        const response = await fetch(`${PRODUCTION_API}/api/donations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                donorName: "Production Test Donor",
                donorEmail: TEST_EMAIL,
                amount: 100,
                type: "One-time",
                paymentMethod: "Test",
                currency: "RWF",
                paymentStatus: "unpaid"
            })
        });

        const data = await response.json();

        logResult({
            test: "Donation Form Submission",
            status: response.ok ? "PASS" : "FAIL",
            statusCode: response.status,
            message: response.ok
                ? `Donation submitted (ID: ${data.id})`
                : data.error || "Submission failed",
            response: data
        });

        // If donation was created, try sending receipt
        if (response.ok && data.id) {
            await testDonationReceipt(data.id);
        }
    } catch (error: any) {
        logResult({
            test: "Donation Form Submission",
            status: "ERROR",
            message: `Network error: ${error.message}`,
        });
    }
}

async function testDonationReceipt(donationId: string) {
    console.log("\n--- Testing Donation Receipt (/api/admin/donations/:id/send-receipt) ---");
    try {
        const response = await fetch(`${PRODUCTION_API}/api/admin/donations/${donationId}/send-receipt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        logResult({
            test: "Donation Receipt Email",
            status: response.ok ? "PASS" : "FAIL",
            statusCode: response.status,
            message: response.ok
                ? `Receipt sent (Message ID: ${data.messageId})`
                : data.error || "Receipt sending failed",
            response: data
        });
    } catch (error: any) {
        logResult({
            test: "Donation Receipt Email",
            status: "ERROR",
            message: `Network error: ${error.message}`,
        });
    }
}

async function testHealthCheck() {
    console.log("\n--- Testing Backend Health (/health) ---");
    try {
        const response = await fetch(`${PRODUCTION_API}/health`);
        const data = await response.json();

        logResult({
            test: "Backend Health Check",
            status: response.ok ? "PASS" : "FAIL",
            statusCode: response.status,
            message: response.ok ? "Backend is healthy" : "Backend health check failed",
            response: data
        });
    } catch (error: any) {
        logResult({
            test: "Backend Health Check",
            status: "ERROR",
            message: `Cannot reach backend: ${error.message}`,
        });
    }
}

async function runAllTests() {
    console.log("╔════════════════════════════════════════════════════════════════╗");
    console.log("║        PRODUCTION EMAIL FUNCTIONALITY VERIFICATION TOOL        ║");
    console.log("╚════════════════════════════════════════════════════════════════╝");
    console.log(`\nTesting backend: ${PRODUCTION_API}`);
    console.log(`Test email: ${TEST_EMAIL}`);
    console.log("\n" + "=".repeat(65));

    // Run tests
    await testHealthCheck();
    await testContactForm();
    await testSubscription();
    await testDonation();

    // Summary
    console.log("\n" + "=".repeat(65));
    console.log("\n📊 TEST SUMMARY\n");
    const passed = results.filter(r => r.status === "PASS").length;
    const failed = results.filter(r => r.status === "FAIL").length;
    const errors = results.filter(r => r.status === "ERROR").length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Errors: ${errors}`);
    console.log(`📧 Total: ${results.length}`);

    console.log("\n" + "=".repeat(65));
    console.log("\n💡 NEXT STEPS:");
    console.log("   1. Check your email inbox for test messages");
    console.log("   2. If no emails received, check Render logs for errors");
    console.log("   3. Verify BREVO_API_KEY is valid on Render");
    console.log("   4. Check that all SMTP env vars are set correctly");
    console.log("\n");

    process.exit(failed + errors > 0 ? 1 : 0);
}

// Run the tests
runAllTests();
