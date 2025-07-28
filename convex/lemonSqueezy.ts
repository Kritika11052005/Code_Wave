// Tells the runtime to use Node.js features like 'crypto'
"use node"

// Import validator helper for type-checking arguments
import { v } from "convex/values";

// Import internalAction to define server-side functions
import { internalAction } from "./_generated/server";

// Import 'createHmac' from Node.js 'crypto' module to compute HMAC signatures
import { createHmac } from "crypto";

// Load the Lemon Squeezy webhook secret from environment variables
const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;
// The exclamation mark (!) tells TypeScript to assume it's always defined

// This function checks if the webhook signature is correct
function verifySignature(payload: string, signature: string): boolean {
    // Create a new HMAC object using SHA-256 algorithm and the secret key
    const hmac = createHmac("sha256", webhookSecret);

    // Hash the payload and convert it to a hexadecimal string
    const computedSignature = hmac.update(payload).digest("hex");

    // Return true if the computed signature matches the one received
    return signature === computedSignature;
}

// Define an internal Convex action called 'verifyWebhook'
export const verifyWebhook = internalAction({
    // Declare the arguments the action expects
    args: {
        payload: v.string(),   // Webhook body as plain text
        signature: v.string(), // X-Signature header value
    },

    // This function runs when the action is called
    handler: async (ctx, args) => {
        // Check if the signature is valid
        const isValid = verifySignature(args.payload, args.signature);

        // If not valid, stop and throw an error
        if (!isValid) {
            throw new Error("Invalid signature");
        }

        // If valid, return the parsed JSON object from the payload string
        return JSON.parse(args.payload);
    }
});
