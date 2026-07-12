const { spawn } = require("node:child_process");
const path = require("node:path");

const port = process.argv[2] || "4173";
const root = path.resolve(__dirname, "..");
const build = spawn(process.execPath, [path.join(root, "scripts", "build.js")], {
  cwd: root,
  stdio: "inherit"
});

build.on("exit", (code) => {
  if (code) {
    process.exit(code);
    return;
  }
  const server = spawn(process.execPath, [path.join(root, "scripts", "serve-static.js"), "dist", port], {
    cwd: root,
    stdio: "inherit"
  });
  server.on("exit", (serverCode) => process.exit(serverCode || 0));
});

