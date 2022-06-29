import type { Chalk } from "chalk";

let _chk: Chalk;

export async function loadColors() {
  if (!_chk) {
    try {
      const { default: chalk } = await import("chalk");
      if (chalk) {
        _chk = new chalk.Instance({ level: 2 });
      }
    } catch (e) {}
  }
}

export const chk: Chalk = new Proxy({} as Chalk, {
  get: (target, prop: keyof Chalk) => {
    if (_chk) {
      return _chk[prop];
    }
    if (["rgb", "hex", "bgHex", "bgRgb"].includes(prop)) {
      // ignore parameters
      return chk;
    }
    return (s: string) => {
      // return unmodified string
      return s;
    };
  },
});

export default chk;
