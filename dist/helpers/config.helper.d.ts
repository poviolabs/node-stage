interface ConfigItem {
    [key: string]: ConfigItem | string | number | string[] | any;
}
export interface Config extends ConfigItem {
    /**
     * Environment as it was set in the config file - use process.env to account for overrides
     */
    readonly environment?: Record<string, string>;
    /**
     * dotenv files used to load environment
     */
    readonly envFiles?: string[];
}
/**
 *  Read config.yaml
 *   - allow for .env file overrides, priority is
 *    1. process.env
 *    2. .env file
 *    3. config.environment
 *   - override config.yaml with process.env.CONFIG_FILE
 *
 */
export declare function loadConfig(root: string, stage: string, options?: {
    service?: string;
    configFileName?: string;
    globalPrefix?: string;
}): Config;
/**
 * parse environment into config
 *  - converts app__one__two=three into {one: {two: "three" }}
 *  - overrides existing nodes
 * @param config
 * @param environment - dict from dot-env file
 * @param prefix - defaults to "app"
 */
export declare function loadEnvironmentIntoConfig(config: Config, environment: Record<string, string>, prefix?: string | false): Config;
/**
 * Read YAML into json tree
 * @param path
 */
export declare function readYaml(path: string): Record<string, any>;
/**
 * Read dot-env file into dict
 * @param root
 * @param name
 */
export declare function readEnv(root: string, name: string): Record<string, string>;
export declare function getVariable(config: Config, p: string): string;
export {};
