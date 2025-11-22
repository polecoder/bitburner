import { NS } from "@ns";
import { MAX_PSERV_INDEX } from "./lib";
import { hack, HACKING_SCRIPT } from "/hack/lib";
import { getWorldServersWithValue } from "/network/lib";
import { shush } from "/utils";

/**
 * Hace hack desde los servidores comprados contra los objetivos más valiosos del mundo.
 *
 * @param ns
 * @returns
 */
export async function main(ns: NS): Promise<void> {
  shush(ns);
  const targets = getWorldServersWithValue(ns);

  for (let i = 0; i <= MAX_PSERV_INDEX; i++) {
    const current = `pserv-${i}`;

    // obtenemos el target
    const target = targets.pop()?.hostname;
    if (!target) return ns.print("WARN: No hay más objetivos disponibles.");

    ns.scp(HACKING_SCRIPT, current, "home");

    hack(ns, current, target);

    ns.print(`INFO: Lanzado hack desde ${current} contra ${target}.`);
  }
}
