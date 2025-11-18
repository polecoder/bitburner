import { AutocompleteData, NS } from "@ns";

/**
 * @param data - context about the game, useful when autocompleting
 * @returns the array of possible autocomplete options
 */
export function autocomplete(data: AutocompleteData) {
  return [...data.servers];
}

/**
 * El algoritmo de hackeo más básico que podemos usar.
 *
 * @param {NS} ns
 */
export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;

  /* eslint-disable no-constant-condition */
  while (true) {
    if (
      ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)
    ) {
      await ns.weaken(target);
    } else if (
      ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)
    ) {
      await ns.grow(target);
    } else {
      await ns.hack(target);
    }
  }
}
