import "reflect-metadata";
import { Options } from "yargs";
import { Config } from "./config.helper";
import { ReleaseStrategy } from "./git.helper";
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
