const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);

if (!args.length) {
  console.error("Usage: node scripts/wrangler-command.js <dev|deploy|...>");
  process.exit(1);
}

const build = spawnSync(process.execPath, [path.join(root, "scripts", "build.js")], {
  cwd: root,
  stdio: "inherit"
});

if (build.status !== 0) {
  process.exit(build.status || 1);
}

const command = process.platform === "win32" ? "wrangler.cmd" : "wrangler";
const result = spawnSync(command, args, {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32"
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status || 0);
