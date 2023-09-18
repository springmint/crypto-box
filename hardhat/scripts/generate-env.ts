import path from "node:path";
import fs from "node:fs";

const envFile = path.join(__dirname, "../../.dev.env");
const envBarFile = path.join(__dirname, "../../.dev.env.bar");

const fileContent = fs.readFileSync(envBarFile).toString();
fs.writeFileSync(envFile, fileContent);
