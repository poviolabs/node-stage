#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { command as slackCommand } from "./slack.command";
import { command as envCommand } from "./env.command";
import { getVersion, logError, logInfo } from "../helpers/cli.helper";

yargs(hideBin(process.argv))
  .version(getVersion() || "unknown")
  .scriptName("node-stage")
  .command(slackCommand)
  .command(envCommand)
  .help()
  .demandCommand(1)
  .strictCommands(true)
  .showHelpOnFail(true)
  .fail((msg, err, yargs) => {
    if (msg) logError(msg);
    if (err) {
      if (!!process.env.VERBOSE) {
        console.error(err);
      } else {
        logError(err.message);
      }
    }
    logInfo("Use '--help' for more info");
    process.exit(1);
  })
  .parse();
