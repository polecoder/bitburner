import { AutocompleteData, NS } from "@ns";
import {
  calculateHgwResult,
  GROW_SCRIPT,
  HACK_SCRIPT,
  nuke,
  prep,
  WEAKEN_SCRIPT,
} from "./lib";
import { HGWData } from "/global";
import { getPurchasedServers } from "/pserv/lib";
import { shush } from "/utils";

/**
 * @param data - context about the game, useful when autocompleting
 * @returns the array of possible autocomplete options
 */
export function autocomplete(data: AutocompleteData) {
  return [...data.servers];
}

/**
 * Script principal que lanza de forma continua batches HGW contra un objetivo desde los servidores comprados con suficiente RAM libre.
 *
 * @deprecated este script no está funcionando correctamente todavía. Usar /pserv/simple.js en su lugar.
 *
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
  shush(ns);

  // target
  const target = ns.args[0] as string;

  // obtengo los servidores comprados
  const purchasedServers = getPurchasedServers(ns);

  // copio los scripts necesarios a los servidores comprados
  const dependencies = [HACK_SCRIPT, GROW_SCRIPT, WEAKEN_SCRIPT];
  for (const pserv of purchasedServers) {
    // copia los scripts necesarios
    for (const script of dependencies) {
      ns.scp(script, pserv, "home");
    }
  }

  // datos necesarios para el batch hgw
  const percentageToSteal = 0.5;
  const hgwResult = calculateHgwResult(ns, target, percentageToSteal);
  if (!hgwResult.possible || hgwResult.data === null) {
    return ns.print(
      `ERROR: No es posible ejecutar el batch hgw contra ${target}. Alguno de los valores calculados no es válido.`
    );
  }
  const hgwData = hgwResult.data;

  // veo que servidores tienen suficiente RAM libre para hackear a target
  for (const pserv of purchasedServers) {
    const maxRam = ns.getServerMaxRam(pserv);
    const usedRam = ns.getServerUsedRam(pserv);
    const freeRam = maxRam - usedRam;
    // si tiene suficiente RAM libre, lanzo el batch
    if (freeRam >= hgwData.ramNeeded) {
      nuke(ns, target);
      await launchHgw(ns, pserv, target, hgwData);
      break; // paso al siguiente target
    }
  }
}

/**
 * PRE-CONDICIÓN: el servidor `hostname` tiene acceso root y suficiente RAM para ejecutar todo el batch.
 * Realiza una operación coordinada de hackeo, crecimiento y debilitamiento en el servidor `target` desde el servidor `hostname`.
 * A pesar de la pre-condición, si no se tiene acceso root o no hay RAM suficiente, se devuelve un mensaje de ERROR con print y se interrumpe la ejecución.
 *
 * @deprecated esta función no está funcionando correctamente todavía. Usar /pserv/simple.js en su lugar.
 *
 * @param ns
 * @param hostname el servidor desde el cual se ejecutan los scripts
 * @param target el servidor objetivo de la operación
 * @param hgwData datos necesarios para ejecutar el batch hgw
 * @returns Promise<void>
 */
async function hgw(
  ns: NS,
  hostname: string,
  target: string,
  hgwData: HGWData
): Promise<void> {
  ns.tprint(`INFO: Lanzando batch HGW contra ${target} desde ${hostname}.`);

  // chequeo de acceso root (redundante)
  if (!ns.hasRootAccess(hostname))
    return ns.print(
      `ERROR: No se tiene acceso root para el servidor ${hostname}.`
    );

  // chequeo de RAM disponible (redundante)
  const maxRam = ns.getServerMaxRam(hostname);
  const usedRam = ns.getServerUsedRam(hostname);
  const freeRam = maxRam - usedRam;
  if (hgwData.ramNeeded > freeRam)
    return ns.print(
      `ERROR: No hay RAM suficiente en ${hostname} para ejecutar el batch hgw.`
    );

  // ejecución de los scripts coordinando la finalización de cada operación
  const delay = 1000;
  ns.exec(WEAKEN_SCRIPT, hostname, hgwData.weakenThreads, target, 0);
  ns.exec(
    GROW_SCRIPT,
    hostname,
    hgwData.growThreads,
    target,
    hgwData.weakenTime - hgwData.growTime - delay
  );
  ns.exec(
    HACK_SCRIPT,
    hostname,
    hgwData.hackThreads,
    target,
    hgwData.weakenTime - hgwData.hackTime - 2 * delay
  );
  await ns.sleep(hgwData.weakenTime + delay);
}

/**
 * Ejecuta de forma continua el batch HGW contra un objetivo desde un servidor específico.
 *
 * @deprecated esta función no está funcionando correctamente todavía. Usar /pserv/simple.js en su lugar.
 *
 * @param ns
 * @param hostname el servidor desde el cual se ejecutan los scripts
 * @param target el servidor objetivo de la operación
 * @param hgwData datos necesarios para ejecutar el batch hgw
 */
async function launchHgw(
  ns: NS,
  hostname: string,
  target: string,
  hgwData: HGWData
) {
  // preparo el servidor
  await prep(ns, hostname, target);

  /* eslint-disable no-constant-condition */
  while (true) {
    await hgw(ns, hostname, target, hgwData);
  }
}
