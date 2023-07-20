import { chmod } from "node:fs/promises";
import { resolve } from "node:path";
import MagicString from "magic-string";
import type { Plugin } from "rollup";

const CLI_MAIN = "bin/cpbox";
const CLI_OTHER = "bin/task.js";

export default function addCliEntry(): Plugin {
  return {
    buildStart() {
      this.emitFile({
        fileName: CLI_MAIN,
        id: "bin/cpbox.ts",
        preserveSignature: false,
        type: "chunk",
      });
      this.emitFile({
        fileName: CLI_OTHER,
        id: "bin/run/batch-generate-wallet/task.ts",
        preserveSignature: false,
        type: "chunk",
      });
    },
    name: "add-bin-entry",
    renderChunk(code, chunkInfo) {
      if (chunkInfo.fileName === CLI_MAIN) {
        const magicString = new MagicString(code);
        magicString.prepend(
          "#!/usr/bin/env node -r source-map-support/register\n\n"
        );
        return {
          code: magicString.toString(),
          map: magicString.generateMap({ hires: true }),
        };
      }
      return null;
    },
    writeBundle({ dir }) {
      chmod(resolve(dir!, CLI_OTHER), "755");
      return chmod(resolve(dir!, CLI_MAIN), "755");
    },
  };
}
