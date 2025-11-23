import { NS } from "@ns";
import { MAX_PSERV_INDEX } from "./lib";
import { getWorldServersWithValue } from "/network/lib";
import { shush } from "/utils";

const HGW_SCRIPT = "/hack/proto.js";

/**
 * Lanza batches hgw desde los servidores comprados contra los objetivos más valiosos del mundo.
 *
 * @deprecated este script no está funcionando correctamente todavía. Usar /pserv/simple.js en su lugar.
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

    ns.exec(HGW_SCRIPT, "home", 1, target);
    ns.print(`INFO: Lanzado batch HGW desde ${current} contra ${target}.`);
  }
}
