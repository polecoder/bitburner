import { NS } from "@ns";
import { getWorldServersWithValue } from "./network/lib";
import { shush } from "./utils";

/**
 * Muestra en pantalla todos los servidores del mundo con su valor asociado.
 *
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
  shush(ns);
  getWorldServersWithValue(ns);
}
