import { NS } from "@ns";

export const HACKING_SCRIPT = "naive.js";

/**
 * Devuelve el número de hilos máximos con el que se puede ejecutar el script `script` en el servidor `hostname`.
 *
 * @param ns
 * @param script
 * @param hostname
 * @returns el máximo número de hilos con el que se puede ejecutar el script
 */
export function getScriptThreads(
  ns: NS,
  script: string,
  hostname: string
): number {
  const maxRam = ns.getServerMaxRam(hostname);
  const usedRam = ns.getServerUsedRam(hostname);
  const freeRam = maxRam - usedRam;

  const scriptRam = ns.getScriptRam(script);

  return Math.floor(freeRam / scriptRam);
}

/**
 * Nukea un servidor si se tienen los suficientes programas como para hacerlo.
 * En caso de que no se tengan, se devuelve un mensaje de WARN con print.
 *
 * @param ns
 * @param target
 */
export function nuke(ns: NS, target: string): void {
  let openPorts = 0;
  if (ns.fileExists("BruteSSH.exe")) {
    ns.brutessh(target);
    openPorts++;
  }
  if (ns.fileExists("FTPCrack.exe")) {
    ns.ftpcrack(target);
    openPorts++;
  }
  if (ns.fileExists("relaySMTP.exe")) {
    ns.relaysmtp(target);
    openPorts++;
  }
  if (ns.fileExists("HTTPWorm.exe")) {
    ns.httpworm(target);
    openPorts++;
  }
  if (ns.fileExists("SQLInject.exe")) {
    ns.sqlinject(target);
    openPorts++;
  }

  if (openPorts < ns.getServerNumPortsRequired(target))
    return ns.print(
      `WARN: El servidor ${target} no tiene suficientes puertos abiertos para nukear.`
    );

  ns.nuke(target);
}

/**
 * Realiza el hackeo del servidor `target` desde el servidor `hostname`.
 * Si no se tiene acceso root o no hay RAM suficiente, se devuelve un mensaje de ERROR con print.
 *
 * @param ns
 * @param hostname
 * @param target
 */
export function hack(ns: NS, hostname: string, target: string): void {
  if (!ns.hasRootAccess(hostname))
    return ns.print(
      `ERROR: No se tiene acceso root para el servidor ${hostname}.`
    );

  const threads = getScriptThreads(ns, HACKING_SCRIPT, hostname);
  if (threads <= 0)
    return ns.print(
      `ERROR: No hay RAM disponible para el hackeo en ${hostname}.`
    );

  // si tengo acceso root, y threads mayores que cero, puedo ejecutar el script
  ns.exec(HACKING_SCRIPT, hostname, threads, target);
}
