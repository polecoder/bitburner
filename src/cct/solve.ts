import { NS } from "@ns";
import { findContracts } from "./lib";
import {
  arrayJumpingGame,
  largestPrimeFactor,
  spiralizeMatrix,
  subarrayWithMaximumSum,
  totalWaysToSum,
  totalWaysToSumII,
} from "./problems";

export async function main(ns: NS): Promise<void> {
  const serversWithContracts = findContracts(ns);

  for (const [server, contracts] of serversWithContracts) {
    ns.tprint(`Servidor: ${server}`);
    for (const contract of contracts) {
      ns.tprint(`  - Contrato: ${contract}`);
      ns.tprint(
        `    - Tipo: ${ns.codingcontract.getContractType(contract, server)}`
      );
      // intentar resolver el contrato si es de los tipos conocidos
      solve(ns, contract, server);
    }
  }

  // // crear contratos dummy de todos los tipos
  // const types = ns.codingcontract.getContractTypes();
  // ns.tprint(`INFO: ${types}`);

  // for (const type of types) {
  //   const filename = ns.codingcontract.createDummyContract(type);
  //   ns.tprint(`Tipo: ${ns.codingcontract.getContractType(filename, "home")}`);
  //   ns.tprint(
  //     `Descripción: ${ns.codingcontract.getDescription(filename, "home")}`
  //   );
  // }

  // resolver los contratos de home
  const server = "home";
  const homeContracts = serversWithContracts.get(server) as string[];
  for (const contract of homeContracts) {
    solve(ns, contract, server);
  }
}

/**
 * Intenta resolver el contrato de tipo `contract` en el servidor `server`.
 * Devuelve un mensaje en la terminal indicando si se ha resuelto con éxito o no.
 *
 * @param ns
 * @param contract
 * @param server
 */
function solve(ns: NS, contract: string, server: string): void {
  // obtener información del contrato
  const type = ns.codingcontract.getContractType(contract, server);
  const data = ns.codingcontract.getData(contract, server);

  // filtrar por tipo de contrato y resolver
  if (type === "Find Largest Prime Factor") {
    const result = largestPrimeFactor(data as number);
    const attempt = ns.codingcontract.attempt(result, contract, server);
    ns.tprint(
      `INFO: Contrato ${contract} resuelto: ${attempt ? "Éxito" : "Fracaso"}`
    );
  } else if (type === "Subarray with Maximum Sum") {
    const result = subarrayWithMaximumSum(data as number[]);
    const attempt = ns.codingcontract.attempt(result, contract, server);
    ns.tprint(
      `INFO: Contrato ${contract} resuelto: ${attempt ? "Éxito" : "Fracaso"}`
    );
  } else if (type === "Total Ways to Sum") {
    const result = totalWaysToSum(data as number);
    const attempt = ns.codingcontract.attempt(result, contract, server);
    ns.tprint(
      `INFO: Contrato ${contract} resuelto: ${attempt ? "Éxito" : "Fracaso"}`
    );
  } else if (type === "Total Ways to Sum II") {
    const result = totalWaysToSumII(data[0] as number, data[1] as number[]);
    const attempt = ns.codingcontract.attempt(result, contract, server);
    ns.tprint(
      `INFO: Contrato ${contract} resuelto: ${attempt ? "Éxito" : "Fracaso"}`
    );
  } else if (type === "Spiralize Matrix") {
    const result = spiralizeMatrix(data as number[][]);
    const attempt = ns.codingcontract.attempt(result, contract, server);
    ns.tprint(
      `INFO: Contrato ${contract} resuelto: ${attempt ? "Éxito" : "Fracaso"}`
    );
  } else if (type === "Array Jumping Game") {
    const result = arrayJumpingGame(data as number[]) !== 0 ? 1 : 0; // el contrato espera 1 si es posible llegar al final, 0 si no
    const attempt = ns.codingcontract.attempt(result, contract, server);
    ns.tprint(
      `INFO: Contrato ${contract} resuelto: ${attempt ? "Éxito" : "Fracaso"}`
    );
  } else if (type === "Array Jumping Game II") {
    const result = arrayJumpingGame(data as number[]);
    const attempt = ns.codingcontract.attempt(result, contract, server);
    ns.tprint(
      `INFO: Contrato ${contract} resuelto: ${attempt ? "Éxito" : "Fracaso"}`
    );
  }
}
