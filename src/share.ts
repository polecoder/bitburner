import { NS } from "@ns";

/**
 * Ejecuta el comando share en un bucle infinito para compartir recursos y ganar más reputación de facción.
 *
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
  /* eslint-disable no-constant-condition */
  while (true) {
    await ns.share();
  }
}
