import { NS } from "@ns";
import { MAX_PSERV_INDEX } from "./pserv/lib";
import { shush } from "./utils";

/**
 * Compra servidores (pserv) con 8GB de RAM hasta el índice máximo definido en MAX_PSERV_INDEX (0-24).
 *
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
  shush(ns);

  const ram = 8;

  for (let i = 0; i <= MAX_PSERV_INDEX; i++) {
    const name = `pserv-${i}`;
    if (ns.getServerMoneyAvailable("home") >= ns.getPurchasedServerCost(ram)) {
      ns.print(`INFO: Comprando servidor ${name} con ${ram}GB de RAM.`);
      ns.purchaseServer(name, ram);
    }
  }
}
