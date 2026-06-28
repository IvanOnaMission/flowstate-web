// Build the production site into dist/.
// The site is now plain static HTML (no React/Babel). This script just assembles
// the pages, shared stylesheet, assets, and the private/ + audit/ folders into dist/.
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}
function copyFile(rel) {
  const from = path.join(ROOT, rel);
  const to = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

// 1. Fresh dist/
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// 2. The pages: home at root, the rest as clean-URL folders (copied whole so
//    nested pages like contact/thanks/ come along automatically).
copyFile("index.html");
for (const dir of ["about", "services", "contact"]) {
  copyDir(path.join(ROOT, dir), path.join(DIST, dir));
}

// 3. Shared stylesheet.
copyFile("styles.css");

// 4. Assets (logo, hero video, team photos, etc.).
copyDir(path.join(ROOT, "assets"), path.join(DIST, "assets"));

// 5. Private secret pages + robots.txt, verbatim.
const PRIVATE = path.join(ROOT, "private");
if (fs.existsSync(PRIVATE)) { copyDir(PRIVATE, DIST); console.log("Copied private/ -> dist/"); }

// 6. Public audit/ lead-magnet page.
const AUDIT = path.join(ROOT, "audit");
if (fs.existsSync(AUDIT)) { copyDir(AUDIT, path.join(DIST, "audit")); console.log("Copied audit/ -> dist/audit/"); }

const pages = ["index.html", "about/index.html", "services/index.html", "contact/index.html"];
console.log("Built dist/ (static multi-page)");
for (const p of pages) console.log("  page:", p, "(" + (fs.statSync(path.join(DIST, p)).size / 1024).toFixed(1) + "KB)");
console.log("  assets:", fs.readdirSync(path.join(DIST, "assets")).join(", "));
