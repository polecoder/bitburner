import { NS } from "@ns";

export const MAX_PSERV_INDEX = 24;

/**
 * Devuelve un array con los nombres de todos los servidores comprados.
 *
 * @param ns
 * @returns un array con los nombres de los servidores comprados
 */
export function getPurchasedServers(ns: NS): string[] {
  const purchasedServers: string[] = [];
  for (let i = 0; i <= MAX_PSERV_INDEX; i++) {
    const serverName = `pserv-${i}`;
    if (ns.serverExists(serverName)) {
      purchasedServers.push(serverName);
    }
  }
  return purchasedServers;
}
