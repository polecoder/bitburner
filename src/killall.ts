import { NS } from "@ns";
import { getWorldServers } from "./network/lib";

/**
 * Recorre todos los servidores del mundo para matar a todos los scripts que están corriendo en ellos.
 *
 * @param {NS} ns
 */
export async function main(ns: NS): Promise<void> {
  const servers = getWorldServers(ns);

  for (const server of servers) {
    ns.killall(server);
  }
}
