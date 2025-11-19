import { NS } from "@ns";
import { MAX_PSERV_INDEX } from "./lib";
import { shush } from "/utils";

/**
 * Mejora a todos los servidores comprados al RAM objetivo pasado por parámetro.
 *
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
  shush(ns);

  const targetRam = ns.args[0] as number;

  for (let i = 0; i <= MAX_PSERV_INDEX; i++) {
    const server = `pserv-${i}`;
    ns.upgradePurchasedServer(server, targetRam);
  }
}
