import { defineConfig } from "vitest/config";

// Required separate suite: absence of the real Redis binary is an error, not
// SKIP. The normal unit suite stays independent of local system services.
export default defineConfig({ test: { environment: "node", include: ["tests/integration/bff-session-store.test.ts"], testTimeout: 15000, hookTimeout: 15000 } });
