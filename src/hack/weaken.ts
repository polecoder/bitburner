import { NS } from "@ns";

/**
 * Ejecuta el `ns.weaken` sobre un objetivo después de un retraso opcional.
 *
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
  const target = ns.args[0] as string;
  const delay = ns.args[1] as number;

  if (delay && delay > 0) {
    await ns.sleep(delay);
  }

  await ns.weaken(target);
}
