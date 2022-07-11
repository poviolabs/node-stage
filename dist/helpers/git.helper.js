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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelease = exports.getShortSha = exports.getSha = exports.getCommitMessage = exports.getGitChanges = exports.getGitVersion = void 0;
const config_types_1 = require("./config.types");
async function simpleGit(p) {
    const { default: _simpleGit } = await Promise.resolve().then(() => __importStar(require("simple-git")));
    return _simpleGit(p);
}
async function getGitVersion(pwd) {
    try {
        const git = await simpleGit(pwd);
        return (await git.raw("--version")).trim();
    }
    catch (e) {
        return undefined;
    }
}
exports.getGitVersion = getGitVersion;
async function getGitChanges(pwd) {
    try {
        const git = await simpleGit(pwd);
        return git.raw("status", "--porcelain");
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}
exports.getGitChanges = getGitChanges;
async function getCommitMessage(pwd) {
    const git = await simpleGit(pwd);
    return (await git.raw("show", "-s", "--format=%s", "HEAD")).trim();
}
exports.getCommitMessage = getCommitMessage;
async function getSha(pwd) {
    const git = await simpleGit(pwd);
    return (await git.raw("rev-parse", "HEAD")).trim();
}
exports.getSha = getSha;
async function getShortSha(pwd) {
    const git = await simpleGit(pwd);
    return (await git.raw("rev-parse", "--short", "HEAD")).trim();
}
exports.getShortSha = getShortSha;
async function getRelease(pwd, strategy = config_types_1.ReleaseStrategy.gitsha, addon) {
    try {
        const git = await simpleGit(pwd);
        const gitSha = await git.revparse("HEAD");
        if (strategy === "gitsha-stage" && addon) {
            return `${gitSha}-${addon}`;
        }
        return gitSha;
    }
    catch (e) {
        return undefined;
    }
}
exports.getRelease = getRelease;
//# sourceMappingURL=git.helper.js.map