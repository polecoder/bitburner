import { NS } from "@ns";

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
