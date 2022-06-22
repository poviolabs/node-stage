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
exports.getToolEnvironment = exports.confirm = exports.promptVar = exports.logBanner = exports.logError = exports.logWarning = exports.logSuccess = exports.logNotice = exports.logVerbose = exports.logInfo = exports.logVariable = exports.nonInteractive = exports.chk = void 0;
const chalk_1 = __importDefault(require("chalk"));
const Console = __importStar(require("console"));
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const process_1 = __importDefault(require("process"));
const git_helper_1 = require("./git.helper");
exports.chk = new chalk_1.default.Instance({ level: 2 });
const log = Console.log;
const prompt = (0, prompt_sync_1.default)({ sigint: true });
exports.nonInteractive = !!process_1.default.env.CI;
/**
 * Print a variable, color it magenta if it's different from the default
 * @param name
 * @param value
 * @param defaultValue
 */
function logVariable(name, value, defaultValue) {
    if (defaultValue !== undefined && defaultValue !== value) {
        log(`${exports.chk.yellow(`${name}:`.padEnd(20))}${exports.chk.magenta(value)}`);
    }
    else {
        log(`${`${name}:`.padEnd(20)}${value}`);
    }
}
exports.logVariable = logVariable;
function logInfo(message) {
    log(`[INFO] ${message}`);
}
exports.logInfo = logInfo;
function logVerbose(message) {
    log(`[VERBOSE] ${message}`);
}
exports.logVerbose = logVerbose;
function logNotice(message) {
    log(exports.chk.magenta(`[NOTICE] ${message}`));
}
exports.logNotice = logNotice;
function logSuccess(message) {
    log(exports.chk.green(`[SUCCESS] ${message}`));
}
exports.logSuccess = logSuccess;
function logWarning(message) {
    log(exports.chk.red(`[WARNING] ${message}`));
}
exports.logWarning = logWarning;
function logError(message) {
    log(exports.chk.red(`[ERROR] ${message}`));
}
exports.logError = logError;
function logBanner(message) {
    log(exports.chk.bgYellow(`==== ${message} ====`));
}
exports.logBanner = logBanner;
/**
 * Set a env variable
 * @param name
 * @param value
 * @param suggested - the value the scripts expects and suggest
 */
function promptVar(name, value, suggested) {
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
        const response = prompt(`Please provide ${exports.chk.yellow(name)} (${suggested}):`, suggested);
        // todo remove previous line to prevent duplicates
        logVariable(name, response, suggested);
        return response;
    }
}
exports.promptVar = promptVar;
async function confirm(message) {
    return (await prompt(message, "yes")) === "yes";
}
exports.confirm = confirm;
async function getToolEnvironment(argv) {
    const env = {
        nodeVersion: process_1.default.version,
    };
    const gitCliVersion = await (0, git_helper_1.getGitVersion)(argv.pwd);
    if (gitCliVersion) {
        env.gitCliVersion = gitCliVersion;
    }
    return env;
}
exports.getToolEnvironment = getToolEnvironment;
//# sourceMappingURL=cli.helper.js.map