import { authHandlers } from "@/lib/auth/oidc/handlers";

// Human read-model integration only. No browser selector or workload Context
// is accepted, and neither this route nor its opt-in enables the R1 dashboard.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = authHandlers().navigation;
