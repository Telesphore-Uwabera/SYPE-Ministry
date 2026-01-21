/**
 * Test Receipt Sending on Production
 */

const PRODUCTION_API = "https://sype-ministry-api.onrender.com";

async function testReceiptSending() {
    console.log("╔════════════════════════════════════════════════════╗");
    console.log("║     TESTING RECEIPT EMAIL ON PRODUCTION            ║");
    console.log("╚════════════════════════════════════════════════════╝\n");

    try {
        // Step 1: Create a test donation
        console.log("📝 Step 1: Creating test donation...");
        const donationResponse = await fetch(`${PRODUCTION_API}/api/donations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                donorName: "Receipt Test Donor",
                donorEmail: "sypeministry@gmail.com",
                amount: 5000,
                type: "One-time",
                paymentMethod: "Test",
                currency: "RWF",
                paymentStatus: "paid"
            })
        });

        if (!donationResponse.ok) {
            const error = await donationResponse.json();
            console.error("❌ Failed to create donation:", error);
            return;
        }

        const donation = await donationResponse.json();
        console.log(`✅ Donation created! ID: ${donation.id}`);
        console.log(`   Donor: ${donation.donorName}`);
        console.log(`   Email: ${donation.donorEmail}`);
        console.log(`   Amount: ${donation.amount} ${donation.currency}\n`);

        // Step 2: Send receipt
        console.log("📧 Step 2: Sending receipt email...");
        const receiptResponse = await fetch(
            `${PRODUCTION_API}/api/admin/donations/${donation.id}/send-receipt`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            }
        );

        const receiptResult = await receiptResponse.json();

        if (!receiptResponse.ok) {
            console.error("❌ Receipt sending FAILED!");
            console.error(`   Status: ${receiptResponse.status}`);
            console.error(`   Error: ${receiptResult.error}`);
            console.error(`   Full response:`, receiptResult);
            process.exit(1);
        }

        console.log("✅ Receipt sent successfully!");
        console.log(`   Message ID: ${receiptResult.messageId}`);
        console.log(`   Receipt marked as sent: ${receiptResult.ok}\n`);

        console.log("═══════════════════════════════════════════════════");
        console.log("✅ TEST PASSED!");
        console.log("═══════════════════════════════════════════════════\n");
        console.log("📬 CHECK YOUR EMAIL:");
        console.log("   To: sypeministry@gmail.com");
        console.log("   Subject: Donation Receipt - SYPE Ministry");
        console.log("   Should include:");
        console.log("   - 'May God bless you abundantly!'");
        console.log("   - Malachi 3:10 verse");
        console.log("   - 2 Corinthians 9:10 prayer");
        console.log("   - Matthew 10:8 closing\n");

        process.exit(0);

    } catch (error) {
        console.error("\n❌ TEST FAILED WITH ERROR:");
        console.error(error);
        process.exit(1);
    }
}

// Run the test
testReceiptSending();
