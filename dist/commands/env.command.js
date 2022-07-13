"use strict";
/*
 Notify a Slack channel
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const yargs_helper_1 = require("../helpers/yargs.helper");
const config_helper_1 = require("../helpers/config.helper");
class EnvOptions {
}
__decorate([
    (0, yargs_helper_1.Option)({ envAlias: "PWD", demandOption: true }),
    __metadata("design:type", String)
], EnvOptions.prototype, "pwd", void 0);
__decorate([
    (0, yargs_helper_1.Option)({ envAlias: "STAGE", demandOption: true }),
    __metadata("design:type", String)
], EnvOptions.prototype, "stage", void 0);
__decorate([
    (0, yargs_helper_1.Option)({ envAlias: "SERVICE" }),
    __metadata("design:type", String)
], EnvOptions.prototype, "service", void 0);
__decorate([
    (0, yargs_helper_1.Option)({
        demandOption: false,
    }),
    __metadata("design:type", Boolean)
], EnvOptions.prototype, "verbose", void 0);
__decorate([
    (0, yargs_helper_1.Option)({
        demandOption: false,
        choices: ["json", "var"],
    }),
    __metadata("design:type", String)
], EnvOptions.prototype, "returnType", void 0);
__decorate([
    (0, yargs_helper_1.Option)({
        demandOption: false,
    }),
    __metadata("design:type", String)
], EnvOptions.prototype, "varPath", void 0);
exports.command = {
    command: "env [returnType] [varPath]",
    describe: "Fetch variables from config",
    builder: async (y) => {
        return y.options((0, yargs_helper_1.getYargsOptions)(EnvOptions)).middleware(async (_argv) => {
            return (await (0, yargs_helper_1.loadYargsConfig)(EnvOptions, _argv));
        }, true);
    },
    handler: async (_argv) => {
        const argv = (await _argv);
        if (!argv.returnType || (argv.returnType === "var" && !argv.varPath)) {
            process.stdout.write(JSON.stringify(Object.fromEntries(Object.entries(argv.config).filter((x) => !["environment", "envFiles"].includes(x[0])))));
            return;
        }
        else if (argv.returnType === "var") {
            process.stdout.write((0, config_helper_1.getVariable)(argv.config, argv.varPath).toString());
        }
        else if (argv.returnType === "json") {
            process.stdout.write(JSON.stringify((0, config_helper_1.getVariable)(argv.config, argv.varPath)));
        }
        else {
            console.log(`returnType "${argv.returnType}" not supported`);
        }
    },
};
//# sourceMappingURL=env.command.js.map