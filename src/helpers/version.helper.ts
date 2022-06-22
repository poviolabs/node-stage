import path from "path";
import fs from "fs";
import { logError } from "./cli.helper";

/**
 * Fetch the version from package.json
 */
export function getVersion(): string | undefined {
  const packageJsonPath = path.join(__dirname, "..", "..", "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      return packageJson.version as string;
    } catch (e) {
      logError((e as Error).toString());
    }
  }
  return undefined;
}
