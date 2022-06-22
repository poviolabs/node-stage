import chalk from "chalk";
export declare const chk: chalk.Chalk;
export declare const nonInteractive: boolean;
/**
 * Print a variable, color it magenta if it's different from the default
 * @param name
 * @param value
 * @param defaultValue
 */
export declare function logVariable(name: string, value: any, defaultValue?: string | number): void;
export declare function logInfo(message: string): void;
export declare function logVerbose(message: string): void;
export declare function logNotice(message: string): void;
export declare function logSuccess(message: string): void;
export declare function logWarning(message: string): void;
export declare function logError(message: string): void;
export declare function logBanner(message: string): void;
/**
 * Set a env variable
 * @param name
 * @param value
 * @param suggested - the value the scripts expects and suggest
 */
export declare function promptVar(name: string, value: string, suggested?: string): string;
export declare function confirm(message: string): Promise<boolean>;
export declare function getToolEnvironment(argv: {
    pwd: string;
    stage?: string;
}): Promise<Record<string, string>>;
