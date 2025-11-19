import { NS } from "@ns";

/**
 * Devuelve un valor numérico que representa el valor de un servidor para ser hackeado.
 * El valor se calcula en base a la cantidad máxima de dinero, el nivel mínimo de seguridad, y el tiempo de weaken.
 * Si el nivel de hacking del jugador no es suficiente para hackear el servidor, devuelve 0.
 *
 * @param ns
 * @param server
 * @returns
 */
export function getServerValue(ns: NS, server: string): number {
  const maxMoney = ns.getServerMaxMoney(server);
  const minSecurity = ns.getServerMinSecurityLevel(server);
  const weakenTime = ns.getWeakenTime(server);
  const hackingLevel = Math.floor(ns.getServerRequiredHackingLevel(server) / 2);

  const canHack = ns.getHackingLevel() >= hackingLevel;
  if (!canHack) return 0;

  return (maxMoney * minSecurity) / weakenTime;
}

/**
 * Devuelve un array con todos los servidores del mundo.
 * Imprime un mensaje de INFO con tprint indicando los servidores encontrados.
 * Implementa un recorrido en profundidad (DFS) para descubrir todos los servidores conectados.
 *
 * @param ns
 * @returns un array con todos los servidores del mundo
 */
export function getWorldServers(ns: NS): string[] {
  // inicialización
  const servers = ["home"] as string[];
  const visited = new Set<string>();

  while (servers.length > 0) {
    const current = servers.pop() as string;
    if (!visited.has(current)) {
      visited.add(current);

      // agrego a los vecinos
      const neighbours = ns.scan(current);
      for (const neighbour of neighbours) {
        servers.push(neighbour);
      }
    }
  }
  ns.tprint("INFO: Los servidores del mundo son: ", visited);
  return Array.from(visited);
}

/**
 * Devuelve un mapa con todos los servidores del mundo y su valor asociado.
 * Imprime un mensaje de INFO con tprint indicando los servidores y su valor.
 *
 * @param ns
 * @returns un mapa con los servidores y su valor
 */
export function getWorldServersWithValue(ns: NS): Map<string, number> {
  const servers = getWorldServers(ns);

  const result = new Map<string, number>();
  for (const server of servers) {
    const value = getServerValue(ns, server);
    result.set(server, value);
    ns.tprint(`INFO: {${server}: ${value}}`);
  }

  return result;
}
