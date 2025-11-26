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
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
  shush(ns);

  // target
  const target = ns.args[0] as string;

  // inicialización
  const purchasedServers = getPurchasedServers(ns);
  const delayBetweenBatches = 1000;

  // copio los scripts necesarios a los servidores comprados
  const dependencies = [HACK_SCRIPT, GROW_SCRIPT, WEAKEN_SCRIPT];
  for (const pserv of purchasedServers) {
    // copia los scripts necesarios
    for (const script of dependencies) {
      ns.scp(script, pserv, "home");
    }
  }

  // preparo al servidor objetivo para el hackeo desde home
  await prep(ns, "home", target);

  // datos necesarios para el batch hgw
  const percentageToSteal = 0.5;
  const hgwResult = calculateHgwResult(ns, target, percentageToSteal);

  if (!hgwResult.possible || hgwResult.data === null) {
    return ns.print(
      `ERROR: No es posible ejecutar el batch hgw contra ${target}. Alguno de los valores calculados no es válido.`
    );
  }

  const hgwData = hgwResult.data;

  for (const pserv of purchasedServers) {
    // chequeo de RAM disponible
    const availableRam = ns.getServerMaxRam(pserv) - ns.getServerUsedRam(pserv);
    const requiredRam =
      ns.getScriptRam(WEAKEN_SCRIPT) * hgwData.weakenThreads +
      ns.getScriptRam(GROW_SCRIPT) * hgwData.growThreads +
      ns.getScriptRam(HACK_SCRIPT) * hgwData.hackThreads;

    // mientras haya RAM suficiente, lanzo el batch hgw de forma continua
    while (availableRam >= requiredRam) {
      nuke(ns, target);
      hgw(ns, pserv, target, hgwData);
      await ns.sleep(delayBetweenBatches);
    }
  }
}

/**
 * PRE-CONDICIÓN: el servidor `hostname` tiene acceso root y suficiente RAM para ejecutar todo el batch.
 * Realiza una operación coordinada de hackeo, crecimiento y debilitamiento en el servidor `target` desde el servidor `hostname`.
 * A pesar de la pre-condición, si no se tiene acceso root o no hay RAM suficiente, se devuelve un mensaje de ERROR con print y se interrumpe la ejecución.
 *
 * @param ns
 * @param hostname el servidor desde el cual se ejecutan los scripts
 * @param target el servidor objetivo de la operación
 * @param hgwData datos necesarios para ejecutar el batch hgw
 */
function hgw(ns: NS, hostname: string, target: string, hgwData: HGWData): void {
  // ejecución de los scripts coordinando la finalización de cada operación
  const delay = 200;
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
}
