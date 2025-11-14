import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// This is needed to handle the raw body for webhook signature verification
export const dynamic = "force-dynamic";

// Get Supabase admin client for webhook operations (bypasses RLS)
function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!process.env.SUPABASE_SECRET_KEY) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not set - required for webhook operations"
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error("No user_id in session metadata");
    throw new Error("No user_id in session metadata");
  }

  const supabaseAdmin = getSupabaseAdmin();
  const subscriptionId = session.subscription as string;
  const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);

  // Get period dates from subscription items (not top-level fields)
  const firstItem = subscription.items?.data?.[0];
  const currentPeriodStart = firstItem?.current_period_start;
  const currentPeriodEnd = firstItem?.current_period_end;

  // Prepare subscription data
  const subscriptionData: any = {
    user_id: userId,
    stripe_customer_id: subscription.customer,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0]?.price.id,
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end || false,
  };

  // Add period dates if they exist
  if (currentPeriodStart) {
    subscriptionData.current_period_start = new Date(
      currentPeriodStart * 1000
    ).toISOString();
  }
  if (currentPeriodEnd) {
    subscriptionData.current_period_end = new Date(
      currentPeriodEnd * 1000
    ).toISOString();
  }

  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    subscriptionData,
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("Error upserting subscription:", error);
    throw error;
  }

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: any) {
  const customerId = subscription.customer as string;
  const supabaseAdmin = getSupabaseAdmin();

  // Find user by customer ID
  const { data: subscriptionData } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!subscriptionData) {
    console.error("No subscription found for customer", customerId);
    return;
  }

  // Get period dates from subscription items
  const firstItem = subscription.items?.data?.[0];
  const currentPeriodStart = firstItem?.current_period_start;
  const currentPeriodEnd = firstItem?.current_period_end;

  const updateData: any = {
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end || false,
  };

  if (currentPeriodStart) {
    updateData.current_period_start = new Date(
      currentPeriodStart * 1000
    ).toISOString();
  }
  if (currentPeriodEnd) {
    updateData.current_period_end = new Date(
      currentPeriodEnd * 1000
    ).toISOString();
  }

  await supabaseAdmin
    .from("subscriptions")
    .update(updateData)
    .eq("user_id", subscriptionData.user_id);

  console.log(`Subscription updated for user ${subscriptionData.user_id}`);
}

async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer as string;
  const supabaseAdmin = getSupabaseAdmin();

  // Find user by customer ID
  const { data: subscriptionData } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!subscriptionData) {
    console.error("No subscription found for customer", customerId);
    return;
  }

  // Set status to canceled and clear subscription data
  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "canceled",
      stripe_subscription_id: null,
      stripe_price_id: null,
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
    })
    .eq("user_id", subscriptionData.user_id);

  console.log(`Subscription deleted for user ${subscriptionData.user_id}`);
}

async function handleInvoicePaid(invoice: any) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  const supabaseAdmin = getSupabaseAdmin();
  const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);

  // Find user by customer ID
  const { data: subscriptionData } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!subscriptionData) {
    console.error("No subscription found for customer", customerId);
    return;
  }

  // Get period dates from subscription items
  const firstItem = subscription.items?.data?.[0];
  const currentPeriodStart = firstItem?.current_period_start;
  const currentPeriodEnd = firstItem?.current_period_end;

  const invoiceUpdateData: any = {
    status: subscription.status,
  };

  if (currentPeriodStart) {
    invoiceUpdateData.current_period_start = new Date(
      currentPeriodStart * 1000
    ).toISOString();
  }
  if (currentPeriodEnd) {
    invoiceUpdateData.current_period_end = new Date(
      currentPeriodEnd * 1000
    ).toISOString();
  }

  await supabaseAdmin
    .from("subscriptions")
    .update(invoiceUpdateData)
    .eq("user_id", subscriptionData.user_id);

  console.log(`Invoice paid for user ${subscriptionData.user_id}`);
}

async function handleInvoicePaymentFailed(invoice: any) {
  const customerId = invoice.customer as string;
  const supabaseAdmin = getSupabaseAdmin();

  // Find user by customer ID
  const { data: subscriptionData } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!subscriptionData) {
    console.error("No subscription found for customer", customerId);
    return;
  }

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "past_due",
    })
    .eq("user_id", subscriptionData.user_id);

  console.log(`Invoice payment failed for user ${subscriptionData.user_id}`);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    console.error("Event type:", event.type);
    console.error("Event ID:", event.id);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Error processing webhook",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
