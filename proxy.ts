import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/stripe/webhook (Stripe webhooks must not have auth middleware)
     * - stock-ui-tests (UI test pages should be public)
     * - login (login page)
     * - auth (auth callback pages)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|stock-ui-tests|login|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
