import type { Plugin, RollupOptions } from "rollup";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import addCliEntry from "./build-plugins/add-cli-entry";
import commonjs from "@rollup/plugin-commonjs";
import cleanBeforeWrite from "./build-plugins/clean-before-write";

const nodePlugins: readonly Plugin[] = [
  nodeResolve({
    exportConditions: ["node"], // add node option here,
    preferBuiltins: false,
  }),
  json(),
  commonjs({
    ignoreTryCatch: false,
    include: "node_modules/**",
    dynamicRequireTargets: ["node_modules/ethereum-cryptography/*.js"],
  }),
  typescript(),
  cleanBeforeWrite("dist"),
];

const commonJsConfig: RollupOptions = {
  input: "src/main.ts",
  output: {
    dir: "dist",
    chunkFileNames: "commonJs/[name].js",
    entryFileNames: "index.cjs.js",
    exports: "named",
    format: "cjs",
    sourcemap: process.env.SOURCEMAP === "true",
  },
  plugins: [...nodePlugins, addCliEntry()],
};

const esConfig: RollupOptions = {
  input: "src/main.ts",
  output: {
    ...commonJsConfig.output,
    chunkFileNames: "es/[name].js",
    entryFileNames: "index.js",
    format: "es",
    sourcemap: process.env.SOURCEMAP === "true",
  },
  plugins: [
    ...nodePlugins,
    terser({ module: true, output: { comments: "some" } }),
  ],
};

const config: RollupOptions[] = [commonJsConfig, esConfig];

export default config;
