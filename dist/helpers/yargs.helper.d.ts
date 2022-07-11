import "reflect-metadata";
import type { Options } from "yargs";
import type { ReleaseStrategy } from "./config.types";
import { Config } from "./config.helper";
interface IOptionProperties extends Options {
    envAlias?: string;
    envAliases?: string[];
    configAlias?: (c: Config) => any;
}
export { Config } from "./config.helper";
export declare function Option(properties: IOptionProperties): (target: object, propertyKey: string) => void;
export declare function getYargsOption<T>(target: any): Record<keyof T, IOptionProperties>;
export declare function getYargsOptions<T>(target: any): Record<keyof T, Options>;
export interface YargsOptions {
    stage: string;
    service?: string;
    pwd: string;
    config: Config;
    release?: string;
    releaseStrategy?: ReleaseStrategy;
}
export declare function loadYargsConfig<T extends YargsOptions>(cls: new () => T, _argv: Record<string, unknown>, configDefaultBase?: string): Promise<T>;
