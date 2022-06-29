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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolEnvironment = exports.confirm = exports.promptVar = exports.logBanner = exports.logError = exports.logWarning = exports.logSuccess = exports.logNotice = exports.logVerbose = exports.logInfo = exports.logVariable = exports.nonInteractive = void 0;
const git_helper_1 = require("./git.helper");
const chalk_helper_1 = __importDefault(require("./chalk.helper"));
exports.nonInteractive = !!process.env.CI;
/**
 * Wraps prop in a dynamic import
 * @param args
 */
async function prompt(...args) {
    const { default: Prompt } = await Promise.resolve().then(() => __importStar(require("prompt-sync")));
    const _prompt = Prompt({ sigint: true });
    return _prompt(...args);
}
/**
 * Print a variable, color it magenta if it's different from the default
 * @param name
 * @param value
 * @param defaultValue
 */
function logVariable(name, value, defaultValue) {
    if (defaultValue !== undefined && defaultValue !== value) {
        console.log(`${chalk_helper_1.default.yellow(`${name}:`.padEnd(20))}${chalk_helper_1.default.magenta(value)}`);
    }
    else {
        console.log(`${`${name}:`.padEnd(20)}${value}`);
    }
}
exports.logVariable = logVariable;
function logInfo(message) {
    console.log(`[INFO] ${message}`);
}
exports.logInfo = logInfo;
function logVerbose(message) {
    console.log(`[VERBOSE] ${message}`);
}
exports.logVerbose = logVerbose;
function logNotice(message) {
    console.log(chalk_helper_1.default.magenta(`[NOTICE] ${message}`));
}
exports.logNotice = logNotice;
function logSuccess(message) {
    console.log(chalk_helper_1.default.green(`[SUCCESS] ${message}`));
}
exports.logSuccess = logSuccess;
function logWarning(message) {
    console.log(chalk_helper_1.default.red(`[WARNING] ${message}`));
}
exports.logWarning = logWarning;
function logError(message) {
    console.log(chalk_helper_1.default.red(`[ERROR] ${message}`));
}
exports.logError = logError;
function logBanner(message) {
    console.log(chalk_helper_1.default.bgYellow(`==== ${message} ====`));
}
exports.logBanner = logBanner;
/**
 * Request a ENV variable from the user if not set
 * @param name
 * @param value
 * @param suggested - the value the scripts expects and suggest
 */
async function promptVar(name, value, suggested) {
    if (value !== undefined) {
        logVariable(name, value, suggested);
        return value;
    }
    if (exports.nonInteractive) {
        if (suggested !== undefined) {
            // take suggestion on CI
            logVariable(name, value, suggested);
            return suggested;
        }
        else {
            throw new Error(`Missing Environment: ${name}`);
        }
    }
    else {
        const response = await prompt(`Please provide ${chalk_helper_1.default.yellow(name)} (${suggested}):`, suggested, {});
        // todo remove previous line to prevent duplicates
        logVariable(name, response, suggested);
        return response;
    }
}
exports.promptVar = promptVar;
async function confirm(message) {
    return (await prompt(message, "yes", {})) === "yes";
}
exports.confirm = confirm;
async function getToolEnvironment(argv) {
    const env = {
        nodeVersion: process.version,
    };
    const gitCliVersion = await (0, git_helper_1.getGitVersion)(argv.pwd);
    if (gitCliVersion) {
        env.gitCliVersion = gitCliVersion;
    }
    return env;
}
exports.getToolEnvironment = getToolEnvironment;
//# sourceMappingURL=cli.helper.js.map