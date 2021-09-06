const path = require("path");

module.exports = () => {
  /**
   * Use UTC time to prevent differences between local and live envs
   */
  process.env.TZ = "utc";
  /**
   * Allow Node to process TypeScript
   */
  const transpileModules = ["@factor", ".*factor", "@darwin_", "dayjs"];
  require("ts-node").register({
    transpileOnly: true,
    compilerOptions: {
      strict: false,
      allowJs: true,
      resolveJsonModule: true,
      moduleResolution: "node",
      module: "commonjs",
      target: "es2020",
      esModuleInterop: true,
    },
    ignore: [`node_modules/(?!(${transpileModules.join("|")}))`],
  });
};
