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
function assertBudget(label, actual, maximum) {
  console.log(label + ": " + size(actual) + " / " + size(maximum));
  if (actual > maximum) throw Error(label + " exceeds approved static asset budget");
}
const largest = (items) => items.reduce((a,b) => b.bytes > a.bytes ? b : a,
  {path: "none", bytes: 0});
assertBudget("All emitted client JavaScript", js.reduce((n,f) => n+f.bytes,0), limits.totalJavaScript);
assertBudget("Largest JavaScript chunk ("+largest(js).path+")", largest(js).bytes, limits.largestJavaScriptChunk);
assertBudget("All emitted CSS", css.reduce((n,f) => n+f.bytes,0), limits.totalCss);
assertBudget("Largest public raster image ("+largest(images).path+")", largest(images).bytes, limits.largestPublicImage);
