import { ReleaseStrategy } from "./config.types";
export declare function getGitVersion(pwd: string): Promise<string | undefined>;
export declare function getGitChanges(pwd: string): Promise<string | undefined>;
export declare function getCommitMessage(pwd: string): Promise<string>;
export declare function getSha(pwd: string): Promise<string>;
export declare function getShortSha(pwd: string): Promise<string>;
export declare function getRelease(pwd: string, strategy?: ReleaseStrategy, addon?: string): Promise<string | undefined>;
