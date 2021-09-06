const path = require("path");
const sao = require("sao");
const consola = require("consola");
const generator = path.resolve(__dirname, "./");
const chalk = require("chalk");

const { name: packageName, version } = require("./package.json");

/**
 * Generate in a custom directory or in current directory?
 */
const outDir = path.resolve(process.argv[2] || ".");

consola.log(`Starting ${packageName}@${version}`);
consola.log();
consola.log(chalk.bold("Success"));
consola.success(`Generating FactorJS project in: ${outDir}`);
consola.log();

// See https://sao.js.org/#/advanced/standalone-cli
sao({ generator, outDir, logLevel: 2 })
  .run()
  .catch((error: any) => {
    consola.error(error);
    process.exit(1);
  });
