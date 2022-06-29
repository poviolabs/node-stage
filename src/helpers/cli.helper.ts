import type { Prompt as PromptSyncPrompt } from "prompt-sync";

import { getGitVersion } from "./git.helper";
import chk from "./chalk.helper";

export const nonInteractive = !!process.env.CI;

/**
 * Wraps prop in a dynamic import
 * @param args
 */
async function prompt(...args: Parameters<PromptSyncPrompt>) {
  const { default: Prompt } = await import("prompt-sync");
  const _prompt = Prompt({ sigint: true });
  return _prompt(...args);
}

/**
 * Print a variable, color it magenta if it's different from the default
 * @param name
 * @param value
 * @param defaultValue
 */
export function logVariable(
  name: string,
  value: any,
  defaultValue?: string | number
) {
  if (defaultValue !== undefined && defaultValue !== value) {
    console.log(`${chk.yellow(`${name}:`.padEnd(20))}${chk.magenta(value)}`);
  } else {
    console.log(`${`${name}:`.padEnd(20)}${value}`);
  }
}

export function logInfo(message: string) {
  console.log(`[INFO] ${message}`);
}

export function logVerbose(message: string) {
  console.log(`[VERBOSE] ${message}`);
}

export function logNotice(message: string) {
  console.log(chk.magenta(`[NOTICE] ${message}`));
}

export function logSuccess(message: string) {
  console.log(chk.green(`[SUCCESS] ${message}`));
}

export function logWarning(message: string) {
  console.log(chk.red(`[WARNING] ${message}`));
}

export function logError(message: string) {
  console.log(chk.red(`[ERROR] ${message}`));
}

export function logBanner(message: string) {
  console.log(chk.bgYellow(`==== ${message} ====`));
}

/**
 * Request a ENV variable from the user if not set
 * @param name
 * @param value
 * @param suggested - the value the scripts expects and suggest
 */
export async function promptVar(
  name: string,
  value: string,
  suggested?: string
) {
  if (value !== undefined) {
    logVariable(name, value, suggested);
    return value;
  }
  if (nonInteractive) {
    if (suggested !== undefined) {
      // take suggestion on CI
      logVariable(name, value, suggested);
      return suggested;
    } else {
      throw new Error(`Missing Environment: ${name}`);
    }
  } else {
    const response = await prompt(
      `Please provide ${chk.yellow(name)} (${suggested}):`,
      suggested as string,
      {}
    );
    // todo remove previous line to prevent duplicates
    logVariable(name, response, suggested);
    return response;
  }
}

export async function confirm(message: string): Promise<boolean> {
  return (await prompt(message, "yes", {})) === "yes";
}

export async function getToolEnvironment(argv: {
  pwd: string;
  stage?: string;
}): Promise<Record<string, string>> {
  const env: Record<string, string> = {
    nodeVersion: process.version,
  };
  const gitCliVersion = await getGitVersion(argv.pwd);
  if (gitCliVersion) {
    env.gitCliVersion = gitCliVersion;
  }
  return env;
}
