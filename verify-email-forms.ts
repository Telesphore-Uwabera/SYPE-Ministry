

import path from "path";
import dotenv from "dotenv";
// Force load .env from current directory before other imports
const envRes = dotenv.config({ path: path.resolve(process.cwd(), ".env") });
if (envRes.error) console.error("Error loading .env:", envRes.error);
console.log("Loaded .env:", envRes.parsed ? "Success" : "Failed");
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL scheme check:", process.env.DATABASE_URL.substring(0, 15) + "...");
}

// Now import app logic
import mongoose from "mongoose";
import { connectMongo } from "./server/lib/mongoose";
import { ContactSubmissionModel, EmailSubscriberModel, DonationModel } from "./server/models/core";
import { createContactSubmission, createSubscriber, createPublicDonation } from "./server/routes/admin";
import { Request, Response } from "express";

// Mock Express Request/Response
function mockReq(body: any): Request {
    return {
        body,
        params: {},
        query: {},
        header: () => "",
    } as any;
}

function mockRes(label: string): Response {
    return {
        status: (code: number) => {
            console.log(`[${label}] Response Status: ${code}`);
            return {
                json: (data: any) => {
                    console.log(`[${label}] Response JSON:`, JSON.stringify(data, null, 2));
                    if (data.error) console.error(`[${label}] ERROR:`, data.error);
                },
                send: () => console.log(`[${label}] Response Sent`),
            };
        },
        json: (data: any) => {
            console.log(`[${label}] Response JSON:`, JSON.stringify(data, null, 2));
        },
    } as any;
}

async function main() {
    console.log("Starting Form Verification...");

    // Connect DB
    await connectMongo();
    console.log("DB Connected.");

    const testEmail = "sypeministry@gmail.com";

    try {
        // 1. Test Contact Form
        console.log("\n--- Testing Contact Form ---");
        const contactReq = mockReq({
            name: "Antigravity Tester",
            email: testEmail,
            subject: "Verification: Contact Form",
            message: "This is a test message from the verification script."
        });
        await createContactSubmission(contactReq, mockRes("Contact"));

        // 2. Test Subscription
        console.log("\n--- Testing Subscription ---");
        // Clean up existing to ensure "new subscriber" flow
        await EmailSubscriberModel.deleteOne({ email: testEmail });

        const subReq = mockReq({
            email: testEmail,
            name: "Antigravity Subscriber"
        });
        await createSubscriber(subReq, mockRes("Subscribe"));

        // 3. Test Public Donation
        console.log("\n--- Testing Public Donation ---");
        const donationReq = mockReq({
            donorName: "Antigravity Donor",
            donorEmail: testEmail,
            amount: 500,
            type: "One-time", // required enum in schema usually, guessing string is fine based on code
            paymentMethod: "MOMO",
            currency: "RWF"
        });
        await createPublicDonation(donationReq, mockRes("Donation"));

    } catch (err) {
        console.error("Test Failed:", err);
    } finally {
        console.log("\nCleaning up...");
        // Optional: Delete the created test records
        await ContactSubmissionModel.deleteMany({ email: testEmail, subject: "Verification: Contact Form" });
        await EmailSubscriberModel.deleteMany({ email: testEmail });
        await DonationModel.deleteMany({ donorEmail: testEmail, donorName: "Antigravity Donor" });

        console.log("Done.");
        process.exit(0);
    }
}

main();
