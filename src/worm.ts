import { AutocompleteData, NS } from "@ns";
import { hack, HACKING_SCRIPT, nuke } from "./hack/lib";
import { getWorldServers } from "./network/lib";

/**
 * @param data - context about the game, useful when autocompleting
 * @returns the array of possible autocomplete options
 */
export function autocomplete(data: AutocompleteData) {
  return [...data.servers];
}

/**
 * Recorre todos los servidores del mundo para hackear al target pasado por parámetro.
 *
 * @param {NS} ns
 */
export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;
  const servers = getWorldServers(ns);

  for (const server of servers) {
    ns.scp(HACKING_SCRIPT, server, "home");
    nuke(ns, server);
    hack(ns, server, target);
  }
}
