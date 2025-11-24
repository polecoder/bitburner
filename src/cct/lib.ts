import { NS } from "@ns";
import { getWorldServers } from "/network/lib";

/**
 * Encuentra todos los contratos CCT en todos los servidores del mundo.
 * Los devuelve en un Map donde la clave es el nombre del servidor y el valor es un array con los nombres de los archivos de contrato. Si no hay contratos en el servidor, no se incluye en el Map.
 *
 * @param ns
 * @returns
 */
export function findContracts(ns: NS): Map<string, string[]> {
  const result = new Map<string, string[]>();

  const servers = getWorldServers(ns);
  for (const server of servers) {
    const contractFiles = ns.ls(server, ".cct");
    if (contractFiles.length === 0) continue;
    result.set(server, contractFiles);
  }

  return result;
}
