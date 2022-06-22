"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelease = exports.ReleaseStrategy = exports.getShortSha = exports.getSha = exports.getCommitMessage = exports.getGitChanges = exports.getGitVersion = void 0;
const simple_git_1 = __importDefault(require("simple-git"));
async function getGitVersion(pwd) {
    try {
        const git = (0, simple_git_1.default)(pwd);
        return (await git.raw("--version")).trim();
    }
    catch (e) {
        return undefined;
    }
}
exports.getGitVersion = getGitVersion;
async function getGitChanges(pwd) {
    try {
        const git = (0, simple_git_1.default)(pwd);
        return git.raw("status", "--porcelain");
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}
exports.getGitChanges = getGitChanges;
async function getCommitMessage(pwd) {
    const git = (0, simple_git_1.default)(pwd);
    return (await git.raw("show", "-s", "--format=%s", "HEAD")).trim();
}
exports.getCommitMessage = getCommitMessage;
async function getSha(pwd) {
    const git = (0, simple_git_1.default)(pwd);
    return (await git.raw("rev-parse", "HEAD")).trim();
}
exports.getSha = getSha;
async function getShortSha(pwd) {
    const git = (0, simple_git_1.default)(pwd);
    return (await git.raw("rev-parse", "--short", "HEAD")).trim();
}
exports.getShortSha = getShortSha;
var ReleaseStrategy;
(function (ReleaseStrategy) {
    ReleaseStrategy["gitsha-stage"] = "gitsha-stage";
    ReleaseStrategy["gitsha"] = "gitsha";
})(ReleaseStrategy = exports.ReleaseStrategy || (exports.ReleaseStrategy = {}));
async function getRelease(pwd, strategy = ReleaseStrategy.gitsha, addon) {
    try {
        const git = (0, simple_git_1.default)(pwd);
        const gitSha = await git.revparse("HEAD");
        if (strategy === "gitsha-stage" && addon) {
            return `${gitSha}-${addon}`;
        }
        return gitSha;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
}
exports.getRelease = getRelease;
//# sourceMappingURL=git.helper.js.map