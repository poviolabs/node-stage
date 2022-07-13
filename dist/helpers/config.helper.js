"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariable = exports.readEnv = exports.readYaml = exports.loadEnvironmentIntoConfig = exports.loadConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const yaml_1 = require("yaml");
__exportStar(require("./config.types"), exports);
/**
 *  Read config.yaml
 *   - allow for .env file overrides, priority is
 *    1. process.env
 *    2. .env file
 *    3. config.environment
 *   - override config.yaml with process.env.CONFIG_FILE
 *
 */
function loadConfig(root, _stage, options = {}) {
    const globalPrefix = options.globalPrefix || process.env.CONFIG_PREFIX || "app";
    const configFileName = options.configFileName || process.env.CONFIG_FILE || "config.yaml";
    const stage = _stage || process.env[`${globalPrefix}__stage`] || process.env.STAGE;
    if (!root || !stage) {
        throw new Error("Stage not defined");
    }
    const service = options.service ||
        process.env[`${globalPrefix}__service`] ||
        process.env.SERVICE;
    let config;
    {
        const yamlPath = path_1.default.join(root, configFileName);
        if (!fs_1.default.existsSync(yamlPath)) {
            // the config file is required
            throw new Error(`Couldn't find configuration file "${yamlPath}"`);
        }
        const configName = service ? `${stage}-${service}` : stage;
        const yamlConfig = readYaml(yamlPath);
        if (!yamlConfig.stages[configName]) {
            throw new Error(`Stage "${configName}" not found in ${configFileName}`);
        }
        config = {
            stage,
            environment: {},
            envFiles: [],
            // read tree from .yaml stage
            ...yamlConfig.stages[configName],
        };
        if (service) {
            config.service = service;
        }
        if (configFileName === "config.yaml") {
            if (fs_1.default.existsSync(path_1.default.join(root, "config.local.yaml"))) {
                const localYamlConfig = readYaml(path_1.default.join(root, "config.local.yaml"));
                if (localYamlConfig.stages[configName]) {
                    mergeDeep(config, localYamlConfig.stages[configName]);
                }
            }
        }
    }
    if (config.env_files) {
        console.warn("env_files was deprecated, please use envFiles instead");
    }
    const environment = {
        // get environment from yaml
        ...config.environment,
        // get .env from envFiles defined in yaml
        ...(config.envFiles
            ? config.envFiles.reduce((acc, cur) => {
                return { ...acc, ...readEnv(root, cur) };
            }, {})
            : {}),
        // and finally from process.env
        ...process.env,
    };
    //  add missing environment variables into process.env
    for (const [k, v] of Object.entries(environment)) {
        if (process.env[k] === undefined && process.env[k] !== v) {
            process.env[k] = v;
        }
    }
    loadEnvironmentIntoConfig(config, environment, globalPrefix);
    return config;
}
exports.loadConfig = loadConfig;
/**
 * parse environment into config
 *  - converts app__one__two=three into {one: {two: "three" }}
 *  - overrides existing nodes
 * @param config
 * @param environment - dict from dot-env file
 * @param prefix - defaults to "app"
 */
function loadEnvironmentIntoConfig(config, environment, prefix = "app" || false) {
    const reservedRoots = ["environment", "envFiles"];
    for (const [key, value] of Object.entries(environment)) {
        if (key.startsWith("__") || key.endsWith("__")) {
            // ignore edge cases
            continue;
        }
        const valuePath = key.split("__");
        if (prefix) {
            // only allow variables with a global prefix
            if (valuePath.shift() !== prefix)
                continue;
        }
        // handle root exceptions
        if (valuePath[0] === undefined || reservedRoots.includes(valuePath[0])) {
            continue;
        }
        // walk the value path
        let p = config;
        while (true) {
            const n = valuePath.shift();
            if (!n)
                break;
            if (valuePath.length !== 0) {
                // we need to walk down more objects
                if (p[n] === undefined) {
                    // there is nothing here, make a new structure
                    p[n] = {};
                    p = p[n];
                    continue;
                }
                if (p[n] && typeof p[n] === "object") {
                    // we're at an object
                    if (Array.isArray(p[n])) {
                        // interaction with arrays is not defined
                        throw new Error(`Tried to change config array: ${key}`);
                    }
                    // move down
                    p = p[n];
                    continue;
                }
                // we need to move down but we cant
                throw new Error(`Tried to change config structure with env: ${key}`);
            }
            // we have a simple value to set
            if (p[n] !== undefined) {
                if (typeof p[n] === "object") {
                    throw new Error(`Tried to override config structure with env: ${key}`);
                }
                // we probably have a simple value
            }
            // set a simple value
            p[n] = value;
            break;
        }
    }
    return config;
}
exports.loadEnvironmentIntoConfig = loadEnvironmentIntoConfig;
/**
 * Read YAML into json tree
 * @param path
 */
function readYaml(path) {
    return (0, yaml_1.parse)(fs_1.default.readFileSync(path, "utf8"), {
        version: "1.1", // support merge keys
    });
}
exports.readYaml = readYaml;
/**
 * Read dot-env file into dict
 * @param root
 * @param name
 */
function readEnv(root, name) {
    const envPath = path_1.default.join(root, name);
    if (envPath) {
        return (0, dotenv_1.parse)(fs_1.default.readFileSync(envPath));
    }
    else {
        console.log(`Notice: env file ${envPath} not found`);
    }
    return {};
}
exports.readEnv = readEnv;
/**
 * Deep merge two objects, mutating the target
 */
function mergeDeep(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    mergeDeep(target, ...sources);
}
function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}
function getVariable(config, p) {
    let n = config;
    for (const i of p.split(".")) {
        if (i in n) {
            n = n[i];
        }
        else {
            return "";
        }
    }
    if (typeof n === "string") {
        return n;
    }
    if (typeof n === "object") {
        return JSON.stringify(n);
    }
    return "";
}
exports.getVariable = getVariable;
//# sourceMappingURL=config.helper.js.map