import chalk from "chalk";
import * as Console from "console";
import Prompt from "prompt-sync";
import process from "process";

import { getGitVersion } from "./git.helper";

export const chk = new chalk.Instance({ level: 2 });
const log = Console.log;
const prompt = Prompt({ sigint: true });

export const nonInteractive = !!process.env.CI;

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
    log(`${chk.yellow(`${name}:`.padEnd(20))}${chk.magenta(value)}`);
  } else {
    log(`${`${name}:`.padEnd(20)}${value}`);
  }
}

export function logInfo(message: string) {
  log(`[INFO] ${message}`);
}

export function logVerbose(message: string) {
  log(`[VERBOSE] ${message}`);
}

export function logNotice(message: string) {
  log(chk.magenta(`[NOTICE] ${message}`));
}

export function logSuccess(message: string) {
  log(chk.green(`[SUCCESS] ${message}`));
}

export function logWarning(message: string) {
  log(chk.red(`[WARNING] ${message}`));
}

export function logError(message: string) {
  log(chk.red(`[ERROR] ${message}`));
}

export function logBanner(message: string) {
  log(chk.bgYellow(`==== ${message} ====`));
}

/**
 * Set a env variable
 * @param name
 * @param value
 * @param suggested - the value the scripts expects and suggest
 */
export function promptVar(name: string, value: string, suggested?: string) {
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
    const response = prompt(
      `Please provide ${chk.yellow(name)} (${suggested}):`,
      suggested as string
    );
    // todo remove previous line to prevent duplicates
    logVariable(name, response, suggested);
    return response;
  }
}

export async function confirm(message: string): Promise<boolean> {
  return (await prompt(message, "yes")) === "yes";
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
