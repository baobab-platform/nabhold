import type { FullResult, Reporter, TestCase, TestResult, FullConfig, Suite } from "@playwright/test/reporter";
import { SmokeObservations, writeObservations } from "../../scripts/integration/evidence.ts";

/** Never print Playwright error details: failed navigation/assertion messages
 * can include callback URLs, cookie values or filled credentials. No trace or
 * storage artifact is produced. Infrastructure retains separate sanitized
 * component diagnostics; this is a smoke outcome, never a signed gate record.
 */
export default class IntegrationReporter implements Reporter {
  private observations = new SmokeObservations();
  private scenario(test: TestCase) {
    const annotations = test.annotations.filter(a => a.type === "nabhold-scenario");
    return annotations.length === 1 ? annotations[0].description : undefined;
  }
  onBegin(_config: FullConfig, suite: Suite) {
    this.observations.begin(suite.allTests().map(test => this.scenario(test)));
  }
  onTestEnd(test: TestCase, result: TestResult) {
    this.observations.endTest(this.scenario(test), result.status);
    console.log(`Integration browser check: ${result.status}`);
  }
  onError() {
    this.observations.error();
    console.error("Integration setup/browser error; inspect private component diagnostics.");
  }
  onEnd(result: FullResult) {
    // This runner-only path is never accepted from the private dotenv file.
    // Missing reporter output makes the parent receipt fail closed as well.
    const directory = process.env.NABHOLD_INTEGRATION_RUN_DIRECTORY;
    if (directory) writeObservations(directory, this.observations.finish(result.status === "passed"));
    console.log(`Identity smoke: ${result.status}; INT-03/G04B acceptance NOT CLAIMED.`);
  }
}
