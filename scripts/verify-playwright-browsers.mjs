import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { chromium, firefox, webkit } from "@playwright/test";

const require = createRequire(import.meta.url);
const expected = require("../package.json").devDependencies["@playwright/test"];
assert.equal(require("@playwright/test/package.json").version, expected);
const fromTest = createRequire(require.resolve("@playwright/test/package.json"));
assert.equal(fromTest("playwright/package.json").version, expected);
const fromPlaywright = createRequire(fromTest.resolve("playwright/package.json"));
assert.equal(fromPlaywright("playwright-core/package.json").version, expected);

// Executable existence is insufficient: all browser engines must launch and
// render using the exact library/browser revision after the pinned install.
for (const engine of [chromium, firefox, webkit]) {
  const browser = await engine.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent("<title>Browser qualification</title><p>ready</p>");
    assert.equal(await page.title(), "Browser qualification");
    console.log(engine.name() + " " + browser.version() + ": launch PASS");
  } finally {
    await browser.close();
  }
}
