import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  /* eslint-disable no-constant-condition */
  while (true) {
    await ns.share();
  }
}
