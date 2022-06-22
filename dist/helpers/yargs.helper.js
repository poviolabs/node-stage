"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadYargsConfig = exports.getYargsOptions = exports.getYargsOption = exports.Option = void 0;
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const config_helper_1 = require("./config.helper");
const git_helper_1 = require("./git.helper");
const optionsKey = Symbol("options_key");
function Option(properties) {
    return (target, propertyKey) => {
        if (properties !== undefined && properties !== null) {
            const newMetadata = {
                ...(Reflect.getMetadata(optionsKey, target) || {}),
                [propertyKey]: {
                    ...properties,
                    describe: properties.envAlias
                        ? `${properties.describe || ""} [${properties.envAlias}]`
                        : properties.describe,
                    type: properties.type ||
                        Reflect.getMetadata("design:type", target, propertyKey).name.toLowerCase(),
                },
            };
            Reflect.defineMetadata(optionsKey, newMetadata, target);
        }
    };
}
exports.Option = Option;
function getYargsOption(target) {
    const options = Reflect.getMetadata(optionsKey, target.prototype);
    if (!options) {
        throw new Error(`Options for ${target.name} were not defined`);
    }
    return options;
}
exports.getYargsOption = getYargsOption;
function getYargsOptions(target) {
    return Object.entries(getYargsOption(target)).reduce((a, [property, options]) => {
        // @ts-ignore
        a[property] = Object.fromEntries(Object.entries(options).filter(([optionName, optionValue]) => !["envAlias", "envAliases", "configAlias", "default"].includes(optionName)));
        return a;
    }, {});
}
exports.getYargsOptions = getYargsOptions;
async function loadYargsConfig(cls, _argv, configDefaultBase) {
    const argv = new cls();
    argv.pwd = path_1.default.resolve(_argv.pwd || process.env.PWD || process.cwd());
    if (!argv.pwd)
        throw new Error("No PWD given");
    const stage = _argv.stage ||
        process.env[`${process.env.CONFIG_PREFIX}__stage`] ||
        process.env.STAGE;
    if (!stage)
        throw new Error("No Stage defined");
    argv.stage = stage;
    let config;
    if (_argv.service) {
        argv.service = _argv.service;
        config = (0, config_helper_1.loadConfig)(argv.pwd, argv.stage, { service: argv.service });
    }
    else {
        config = (0, config_helper_1.loadConfig)(argv.pwd, argv.stage);
    }
    for (const [name, o] of Object.entries(getYargsOption(cls))) {
        if (["pwd", "stage", "config"].includes(name)) {
            continue;
        }
        argv[name] =
            // yargs is always right
            _argv[name] ||
                // default to config if set
                (configDefaultBase && config[configDefaultBase]?.[name]) ||
                // fallback to env
                (o.envAlias && process.env[o.envAlias]);
        // write alias back into process.env
        if (o.envAlias &&
            process.env[o.envAlias] !==
                argv[name]) {
            if (process.env[o.envAlias] !== undefined) {
                console.warn(`Overwriting ${o.envAlias}!`);
            }
            process.env[o.envAlias] = argv[name];
        }
        // fallback to default
        if (argv[name] === undefined && o.default) {
            // use default from yargs
            argv[name] = o.default;
        }
    }
    argv.release = await (0, git_helper_1.getRelease)(argv.pwd, argv.releaseStrategy);
    argv.config = config;
    return argv;
}
exports.loadYargsConfig = loadYargsConfig;
//# sourceMappingURL=yargs.helper.js.map