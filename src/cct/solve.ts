import { NS } from "@ns";
import { findContracts } from "./lib";
import { largestPrimeFactor, subarrayWithMaximumSum } from "./problems";

export async function main(ns: NS): Promise<void> {
  const serversWithContracts = findContracts(ns);

  for (const [server, contracts] of serversWithContracts) {
    ns.tprint(`Servidor: ${server}`);
    for (const contract of contracts) {
      ns.tprint(`  - Contrato: ${contract}`);
      ns.tprint(
        `    - Tipo: ${ns.codingcontract.getContractType(contract, server)}`
      );
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
  const homeContracts = serversWithContracts.get("home") as string[];
  for (const contract of homeContracts) {
    const type = ns.codingcontract.getContractType(contract, "home");
    const data = ns.codingcontract.getData(contract, "home");

    if (type === "Find Largest Prime Factor") {
      const result = largestPrimeFactor(data as number);
      const attempt = ns.codingcontract.attempt(result, contract, "home");
      ns.tprint(
        `INFO: Contrato ${contract} resuelto: ${attempt ? "Éxito" : "Fracaso"}`
      );
    } else if (type === "Subarray with Maximum Sum") {
      const result = subarrayWithMaximumSum(data as number[]);
      const attempt = ns.codingcontract.attempt(result, contract, "home");
      ns.tprint(
        `INFO: Contrato ${contract} resuelto: ${attempt ? "Éxito" : "Fracaso"}`
      );
    }
  }
}
