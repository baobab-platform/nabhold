import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

// Match the approved ZuriBeans baseline. Limits are not changed to make red
// builds green; changes require measured evidence and architecture review.
export const limits = Object.freeze({
  totalJavaScript: 800 * 1024,
  largestJavaScriptChunk: 250 * 1024,
  totalCss: 64 * 1024,
  largestPublicImage: 250 * 1024,
});

const root = process.cwd();
async function walk(directory, optional = false) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) {
    if (optional && error.code === "ENOENT") return [];
    throw error;
  }
  const children = await Promise.all(entries.map(async (entry) => {
    const full = join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  }));
  return children.flat();
}
const all = await walk(join(root, ".next", "static"));
const bytes = async (paths) => Promise.all(paths.map(async (path) => ({
  path: relative(root, path), bytes: (await stat(path)).size,
})));
const js = await bytes(all.filter((f) => f.endsWith(".js")));
const css = await bytes(all.filter((f) => f.endsWith(".css")));
const images = await bytes((await walk(join(root, "public"), true))
  .filter((f) => /\.(avif|jpe?g|png|webp)$/i.test(f)));
if (!js.length || !css.length) throw Error("Missing emitted static JS/CSS: build required before the budget gate.");
const size = (n) => (n / 1024).toFixed(1) + " KiB";
const largest = (items) => items.reduce((a, b) => b.bytes > a.bytes ? b : a,
  {path: "none", bytes: 0});
const measured = [
  { label: "All emitted client JavaScript", actual: js.reduce((n, f) => n + f.bytes, 0), max: limits.totalJavaScript },
  { label: "Largest JavaScript chunk (" + largest(js).path + ")", actual: largest(js).bytes, max: limits.largestJavaScriptChunk },
  { label: "All emitted CSS", actual: css.reduce((n, f) => n + f.bytes, 0), max: limits.totalCss },
  { label: "Largest public raster image (" + largest(images).path + ")", actual: largest(images).bytes, max: limits.largestPublicImage },
];
const oversized = measured.filter((item) => item.actual > item.max);
for (const {label, actual, max} of measured)
  console.log(label + ": " + size(actual) + " / " + size(max) +
    (actual > max ? " [OVER BUDGET]" : " [PASS]"));

// The emitted aggregate includes all lazily split routes. Diagnose *which*
// chunks are responsible before changing either source code or the limit.
const largestChunks = [...js].sort((a, b) => b.bytes - a.bytes).slice(0, 30);
console.log("Largest JavaScript chunks: " + JSON.stringify(
  largestChunks.map((f) => ({ path: f.path, kib: Number((f.bytes / 1024).toFixed(1)) })),
));
console.log("CSS inventory: " + JSON.stringify(css.map((f) => ({path: f.path,
  kib: Number((f.bytes / 1024).toFixed(1))}))));
const { mkdir, writeFile } = await import("node:fs/promises");
await mkdir(join(root, "reports"), { recursive: true });
await writeFile(join(root, "reports", "static-budget.json"),
  JSON.stringify({ profile: "CI_PRODUCTION_BUILD", limits, measured,
    largestChunks, css, oversized: oversized.map((x) => x.label) }, null, 2) + "\n",
  { flag: "w" });
if (oversized.length)
  throw Error("Approved asset budgets exceeded: " + oversized.map((x) => x.label).join("; "));
