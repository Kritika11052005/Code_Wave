// Import the HTTP router utility from Convex
import { httpRouter } from "convex/server";

// Import httpAction to define server-side HTTP handlers
import { httpAction } from "./_generated/server";

// Import Clerk's WebhookEvent type (used to type webhook events)
import { WebhookEvent } from "@clerk/nextjs/server";

// Import the Webhook class from Svix, used to verify webhooks from Clerk
import { Webhook } from "svix";

// Import backend API routes and internal actions
import { api, internal } from "./_generated/api";

// Create a new HTTP router
const http = httpRouter();

// Define a POST endpoint for LemonSqueezy webhook events
http.route({
    path: "/lemon-squeezy-webhook",  // URL path
    method: "POST",                  // HTTP method
    handler: httpAction(async (ctx, request) => {
        // Read the request body as text (not JSON)
        const payloadString = await request.text();

        // Get the signature from the headers to verify the webhook
        const signature = request.headers.get("X-Signature");

        // If no signature header is provided, return an error
        if (!signature) {
            return new Response("Missing X-Signature header", { status: 400 });
        }

        try {
            // Verify the webhook using internal server logic
            const payload = await ctx.runAction(internal.lemonSqueezy.verifyWebhook, {
                payload: payloadString,
                signature
            });

            // Check if the webhook event is "order_created"
            if (payload.meta.event_name === "order_created") {
                const { data } = payload;

                // Run a mutation to upgrade the user to "Pro"
                const { success } = await ctx.runMutation(api.users.upgradeToPro, {
                    email: data.attributes.user_email,
                    lemonSqueezyCustomerId: data.attributes.customer_id.toString(),
                    lemonSqueezyOrderId: data.id,
                    amount: data.attributes.total,
                });

                // If upgrade was successful, we could do something extra here (optional)
                if (success) {
                    // Example: Send an email to the user (not implemented here)
                }
            }

            // If everything went well, return success response
            return new Response("Webhook processed successfully", { status: 200 });

        } catch (error) {
            // If something went wrong, return a server error
            return new Response("Error processing webhook", { status: 500 });
        }
    })
});

// Define a POST endpoint for Clerk webhook events
http.route({
    path: "/clerk-webhook",  // URL path
    method: "POST",          // HTTP method
    handler: httpAction(async (ctx, request) => {
        // Get the Clerk webhook secret from environment variables
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

        // If the secret is missing, throw an error (this is a setup/config error)
        if (!webhookSecret) {
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }

        // Get the required Svix headers for verifying the webhook
        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        // If any required headers are missing, return an error response
        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("Error occurred--no svix headers", { status: 400 });
        }

        // Parse the request body as JSON
        const payload = await request.json();

        // Convert the payload back to string format for verification
        const body = JSON.stringify(payload);

        // Create a new Webhook object using the secret
        const wh = new Webhook(webhookSecret);

        let evt: WebhookEvent; // Will hold the verified webhook event

        try {
            // Verify the webhook using the headers and payload
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            // If verification fails, log the error and return 400
            console.error("Error verifying webhook", err);
            return new Response("Error occurred", { status: 400 });
        }

        // Get the type of webhook event
        const eventType = evt.type;

        // If the event is "user.created", sync the user to our database
        if (eventType == "user.created") {
            const { id, email_addresses, first_name, last_name } = evt.data;

            // Extract the user's primary email address
            const email = email_addresses[0].email_address;

            // Combine first and last name into a full name
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            try {
                // Save the user in our database using a mutation
                await ctx.runMutation(api.users.syncUser, {
                    userId: id,
                    email,
                    name,
                });
            } catch (error) {
                // If saving fails, log the error and return a 500 error
                console.log("Error creating user: ", error);
                return new Response("Error creating user", { status: 500 });
            }
        }

        // Return success if everything worked
        return new Response("WebHook processed successfully", { status: 200 });
    })
});

// Export the configured HTTP router so it can be used by the backend
export default http;
