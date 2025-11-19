import { NS } from "@ns";
import { getScriptThreads } from "/hack/lib";
import { MAX_PSERV_INDEX } from "/pserv/lib";

/**
 * Corre el script de share en todos los servidores personales comprados a partir del pserv-12.
 * Si no hay RAM suficiente en un servidor, se imprime una advertencia y se continúa con el siguiente.
 *
 * @param ns
 * @returns
 */
export async function main(ns: NS): Promise<void> {
  const SHARE_SCRIPT = "share.js";
  for (let i = 12; i <= MAX_PSERV_INDEX; i++) {
    const server = `pserv-${i}`;
    ns.scp(SHARE_SCRIPT, server, "home");

    const threads = getScriptThreads(ns, SHARE_SCRIPT, server);
    if (threads <= 0) {
      ns.print(
        `WARN: No hay RAM suficiente en ${server} para correr ${SHARE_SCRIPT}.`
      );
      continue;
    }

    ns.exec(SHARE_SCRIPT, server, threads);
  }
}
