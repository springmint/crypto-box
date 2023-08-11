import type { Plugin } from "rollup";
import dotenv from "dotenv";

const ENV_VARS = ["NODE_ENV", "BASE_URL"];
const ENV_PREFIX = "CPBOX_";

export default function addEnvEntry(): Plugin {
  return {
    name: "add-env",
    buildStart() {
      if (process.env.NODE_ENV === "development") {
        dotenv.config({ path: ".dev.env" });
      } else if (process.env.NODE_ENV === "production") {
        dotenv.config({ path: ".env" });
      }
    },
    resolveImportMeta(property) {
      if (property === "env") {
        const processEnv = Object.create(null);
        ENV_VARS.forEach((v) => {
          processEnv[v] = process.env[v] || null;
        });
        Object.entries(process.env).forEach(([key, val]) => {
          if (key.startsWith(ENV_PREFIX)) {
            processEnv[key.replace(ENV_PREFIX, "")] = process.env[key];
          }
        });
        return processEnv;
      }
      return null;
    },
  };
}
