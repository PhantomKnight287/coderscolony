const cssModulesPlugin = require("esbuild-css-modules-plugin");
require("esbuild").build({
  entryPoints: ["./src/index.tsx"],
  bundle: true,
  outfile: "dist/index.js",
  format: "esm",
  target: ["chrome58", "edge16", "firefox57", "safari11"],
  sourcemap: "external",
  watch: true,
  plugins: [cssModulesPlugin()],
  logLevel:"info"
});
