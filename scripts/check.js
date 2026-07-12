const { spawnSync } = require("node:child_process");

const npmCommand = process.env.npm_execpath
  ? [process.execPath, [process.env.npm_execpath]]
  : ["npm", []];

const commands = [
  ["build"],
  ["test:data"],
  ["test:unit"],
  ["test:e2e:smoke"],
  ["test:a11y"],
  ["measure"]
];

for (const [script] of commands) {
  const [command, baseArgs] = npmCommand;
  const args = [...baseArgs, "run", script];
  console.log(`\n> npm run ${script}`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: !process.env.npm_execpath && process.platform === "win32" });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}
