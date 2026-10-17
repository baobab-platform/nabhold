import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";

/** Never print Playwright error details: failed navigation/assertion messages
 * can include callback URLs, cookie values or filled credentials. No trace or
 * storage artifact is produced. Infrastructure retains separate sanitized
 * component diagnostics; this is a smoke outcome, never a signed gate record.
 */
export default class IntegrationReporter implements Reporter {
  onTestEnd(_test: TestCase, result: TestResult) {
    console.log(`Integration browser check: ${result.status}`);
  }
  onError() { console.error("Integration setup/browser error; inspect private component diagnostics."); }
  onEnd(result: FullResult) {
    console.log(`Identity smoke: ${result.status}; INT-03/G04B acceptance NOT CLAIMED.`);
  }
}
