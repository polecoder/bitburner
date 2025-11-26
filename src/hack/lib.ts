import { NS } from "@ns";
import { HGWResult } from "/global";

export const HACKING_SCRIPT = "naive.js";
export const HACK_SCRIPT = "hack/hack.js";
export const GROW_SCRIPT = "hack/grow.js";
export const WEAKEN_SCRIPT = "hack/weaken.js";

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

/**
 * Prepara el servidor `target` desde el servidor `hostname` para el hackeo. Es decir debilitar la seguridad hasta su valor mínimo y aumentar el dinero disponible hasta su valor máximo.
 * Si no se tiene acceso root o no hay RAM suficiente, se devuelve un mensaje de ERROR con print.
 *
 * @param ns
 * @param hostname
 * @param target
 * @returns Promise<void>
 */
export async function prep(
  ns: NS,
  hostname: string,
  target: string
): Promise<void> {
  ns.print(`INFO: Preparando el servidor ${target} desde ${hostname}.`);
  // chequeo de acceso root
  if (!ns.hasRootAccess(hostname))
    return ns.print(
      `ERROR: No se tiene acceso root para el servidor ${hostname}.`
    );

  // separo en dos la RAM para hacer weaken y grow
  let threads = getScriptThreads(ns, WEAKEN_SCRIPT, hostname);
  threads = Math.floor(threads / 3);
  if (threads <= 0)
    return ns.print(
      `ERROR: No hay RAM disponible para el hackeo en ${hostname}.`
    );

  // tiempo de weaken
  const weakenTime = ns.getWeakenTime(target);

  // mientras el servidor no esté preparado, lo preparo
  while (
    ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) ||
    ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)
  ) {
    ns.exec(WEAKEN_SCRIPT, hostname, threads, target);
    ns.exec(GROW_SCRIPT, hostname, threads, target);
    await ns.sleep(weakenTime);
  }

  ns.print(`INFO: Servidor ${target} preparado.`);
}

/**
 * Obtiene los datos necesarios para realizar una operación coordinada de hackeo, crecimiento y debilitamiento (hgw) en el servidor `target`, robando un porcentaje `percentageToSteal` del dinero máximo del servidor.
 *
 * @param ns
 * @param target el servidor objetivo de la operación
 * @param percentageToSteal porcentaje del dinero máximo del servidor a robar en la operación (valor entre 0 y 1)
 * @returns `HGWResult` con los datos necesarios para ejecutar el batch hgw
 */
export function calculateHgwResult(
  ns: NS,
  target: string,
  percentageToSteal: number
): HGWResult {
  // variables de tiempo
  const hackTime = ns.getHackTime(target);
  const growTime = ns.getGrowTime(target);
  const weakenTime = ns.getWeakenTime(target);

  // dinero
  const maxMoney = ns.getServerMaxMoney(target);
  const moneyToSteal = maxMoney * percentageToSteal;
  const server = ns.getServer(target);

  // preparo el servidor para los cálculos
  server.moneyAvailable = maxMoney;
  server.hackDifficulty = server.minDifficulty;

  // hack threads
  const percentagePerThread = ns.formulas.hacking.hackPercent(
    server,
    ns.getPlayer()
  );
  const hackThreads = Math.ceil(percentageToSteal / percentagePerThread);
  if (!isFinite(hackThreads) || hackThreads <= 0) {
    ns.print(`ERROR: Los threads para el hackeo en ${target} no son válidos.`);
    return { possible: false, data: null };
  }

  // grow threads
  server.moneyAvailable = maxMoney - moneyToSteal;
  const growThreads = ns.formulas.hacking.growThreads(
    server,
    ns.getPlayer(),
    maxMoney
  );

  // weaken threads
  const hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreads);
  const growSecurityIncrease = ns.growthAnalyzeSecurity(growThreads);
  const totalSecurityIncrease = hackSecurityIncrease + growSecurityIncrease;
  const weakenSecurityDecrease = ns.weakenAnalyze(1);
  const weakenThreads = Math.ceil(
    totalSecurityIncrease / weakenSecurityDecrease
  );

  // chequeo que el servidor tenga RAM suficiente para ejecutar el batch
  const ramNeeded =
    ns.getScriptRam(WEAKEN_SCRIPT, "home") * weakenThreads +
    ns.getScriptRam(GROW_SCRIPT, "home") * growThreads +
    ns.getScriptRam(HACK_SCRIPT, "home") * hackThreads;

  // retorno el resultado
  const data = {
    hackThreads,
    growThreads,
    weakenThreads,
    hackTime,
    growTime,
    weakenTime,
    ramNeeded,
  };
  ns.print(`DATA: Datos de HGW para ${target}: ${JSON.stringify(data)}.`);
  return { possible: true, data };
}
