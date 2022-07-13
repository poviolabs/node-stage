/*
 Notify a Slack channel
 */

import yargs from "yargs";

import {
  Config,
  getYargsOptions,
  Option,
  YargsOptions,
  loadYargsConfig,
} from "../helpers/yargs.helper";

import { getVariable } from "../helpers/config.helper";

class EnvOptions implements YargsOptions {
  @Option({ envAlias: "PWD", demandOption: true })
  pwd!: string;

  @Option({ envAlias: "STAGE", demandOption: true })
  stage!: string;

  @Option({ envAlias: "SERVICE" })
  service?: string;

  @Option({
    demandOption: false,
  })
  verbose!: boolean;

  @Option({
    demandOption: false,
    choices: ["json", "var"],
  })
  returnType!: string;

  @Option({
    demandOption: false,
  })
  varPath!: string;

  config!: Config;
}

export const command: yargs.CommandModule = {
  command: "env [returnType] [varPath]",
  describe: "Fetch variables from config",
  builder: async (y) => {
    return y.options(getYargsOptions(EnvOptions)).middleware(async (_argv) => {
      return (await loadYargsConfig(EnvOptions, _argv as any)) as any;
    }, true);
  },
  handler: async (_argv) => {
    const argv = (await _argv) as unknown as EnvOptions;

    if (!argv.returnType || (argv.returnType === "var" && !argv.varPath)) {
      process.stdout.write(
        JSON.stringify(
          Object.fromEntries(
            Object.entries(argv.config).filter(
              (x) => !["environment", "envFiles"].includes(x[0])
            )
          )
        )
      );
      return;
    } else if (argv.returnType === "var") {
      process.stdout.write(getVariable(argv.config, argv.varPath).toString());
    } else if (argv.returnType === "json") {
      process.stdout.write(
        JSON.stringify(getVariable(argv.config, argv.varPath))
      );
    } else {
      console.log(`returnType "${argv.returnType}" not supported`);
    }
  },
};
