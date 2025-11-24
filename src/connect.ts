import { AutocompleteData, NS } from "@ns";
import { getWorldServers } from "./network/lib";

/**
 * @param data - context about the game, useful when autocompleting
 * @returns the array of possible autocomplete options
 */
export function autocomplete(data: AutocompleteData) {
  return [...data.servers];
}

/**
 * Conecta a un servidor de destino `destination` desde home.
 *
 * @param ns
 */
export async function main(ns: NS): Promise<void> {
  const destination = ns.args[0] as string;
  const paths = dijkstra(ns);
  connectTo(destination, paths);
}

/**
 * Encuentra el camino más corto desde "home" hasta un servidor de destino usando el algoritmo de Dijkstra.
 * Lo devuelve como un mapa donde la clave es el servidor y el valor es el servidor anterior en el camino más corto desde "home".
 *
 * @param ns
 * @param destination el servidor destino
 * @returns
 */
function dijkstra(ns: NS): Map<string, string | null> {
  // inicialización
  const distances = new Map<string, number>();
  const paths = new Map<string, string | null>();
  const servers = getWorldServers(ns);

  for (const server of servers) {
    distances.set(server, Infinity);
    paths.set(server, null);
  }
  distances.set("home", 0);
  paths.set("home", null);

  while (servers.length != 0) {
    // obtener el nodo con la distancia mínima y removerlo de la lista
    let minimum = Infinity;
    let current = "";
    for (const server of servers) {
      const distance = distances.get(server) as number;
      if (distance < minimum) {
        minimum = distance;
        current = server;
      }
    }
    servers.splice(servers.indexOf(current), 1);

    // trabajar con los vecinos
    const neighbors = ns.scan(current);
    for (const neighbor of neighbors) {
      const newDistance = (distances.get(current) as number) + 1;

      // encontré un camino más corto, lo actualizo
      if (newDistance < (distances.get(neighbor) as number)) {
        distances.set(neighbor, newDistance);
        paths.set(neighbor, current);
      }
    }
  }

  return paths;
}

/**
 * Reconstruye y ejecuta el camino desde "home" hasta un servidor destino.
 * Simula la escritura en la terminal del juego usando la documentación oficial del juego.
 *
 * @param ns
 * @param destination destino al que conectarse
 * @param paths mapa de caminos generado por dijkstra
 */
function connectTo(
  destination: string,
  paths: Map<string, string | null>
): void {
  // reconstruyo el camino desde destination hasta home
  let command = `connect ${destination}`;
  let current = paths.get(destination);
  while (current !== null && current !== undefined) {
    command = `connect ${current};` + command;
    current = paths.get(current) as string | null;
  }

  // simular la escritura en la terminal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const input = globalThis["document"].getElementById("terminal-input") as any;
  input.value = command;
  const handler = Object.keys(input)[1];
  input[handler].onChange({
    target: input,
  });
  input[handler].onKeyDown({
    key: "Enter",
    preventDefault: () => null,
  });
}
