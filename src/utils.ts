import { NS } from "@ns";

/**
 * Desactiva todos los logs de las funciones nativas del juego.
 *
 * @param ns
 */
export function shush(ns: NS) {
  ns.disableLog("ALL");
}
