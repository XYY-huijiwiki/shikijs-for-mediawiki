import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  build: {
    minify: "terser",
    manifest: true,
  },
  server: {
    cors: true,
  },
  plugins: [cssInjectedByJsPlugin()],
  base: "https://xyy-huijiwiki.github.io/shikijs-for-mediawiki/",
});
