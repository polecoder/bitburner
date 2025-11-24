/**
 * Encuentra el mayor factor primo de un número dado por el parámetro `number`.
 *
 * @param number el número al cual se le quiere encontrar el mayor factor primo
 * @returns el mayor factor primo del número dado
 */
export function largestPrimeFactor(number: number): number {
  let result = 2;
  while (number > 1) {
    const maxPossibleDivisor = Math.floor(Math.sqrt(number));
    while (number % result === 0) {
      number /= result;
    }
    // si ya superé el máximo divisor posible, entonces retorno el número actual (que es primo)
    if (result > maxPossibleDivisor) return number;

    // todavía no superamos el máximo divisor posible
    result += 1;
  }
  return result;
}

/**
 * Encuentra el subarray con la suma máxima en un array de números enteros pasado por el parámetro `data`.
 *
 * @param data el array de números enteros en el cual se quiere encontrar el subarray con la suma máxima
 * @returns el subarray con la suma máxima
 */
export function subarrayWithMaximumSum(data: number[]): number {
  let maximum = -Infinity;
  for (let i = 0; i < data.length; i++) {
    // para cada índice i, pruebo todos los subarrays que terminan en i, si su suma es mayor que el máximo actual, actualizo el máximo y el array resultado
    for (let j = i; j >= 0; j--) {
      const subarray = data.slice(j, i + 1);
      const sum = subarray.reduce((a, b) => a + b, 0);
      if (sum > maximum) {
        maximum = sum;
      }
    }
  }
  return maximum;
}

/**
 * Calcula el número total de formas en que un número dado puede ser expresado como la suma de números enteros positivos.
 *
 * @param number el número del cual se quieren contar las formas de ser sumado
 * @returns el número total de formas en que el número puede ser expresado como la suma de números enteros positivos
 */
export function totalWaysToSum(number: number): number {
  /**
   * Cuenta las formas de sumar `number` usando sumandos hasta `maxAddend`.
   * Guarda los resultados intermedios en un mapa `memo` para evitar cálculos repetidos (programación dinámica con memoización).
   * Función auxiliar recursiva.
   *
   * @param number el número del que se quieren contar las formas de sumar
   * @param maxAddend el máximo sumando permitido en la suma
   */
  function countWays(
    number: number,
    maxAddend: number,
    memo: Map<string, number> = new Map<string, number>()
  ): number {
    if (number === 0) return 1; // una forma de sumar 0: no usar sumandos
    if (number < 0 || maxAddend < 1) return 0; // no hay formas de sumar un número negativo o si no hay sumandos disponibles

    const key = `${number},${maxAddend}`;
    if (memo.has(key)) return memo.get(key) as number;

    //
    const result =
      countWays(number, maxAddend - 1, memo) +
      countWays(number - maxAddend, maxAddend, memo);

    memo.set(key, result);
    return result;
  }

  // Usamos n-1 como máximo para excluir automáticamente "n solo"
  return countWays(number, number - 1);
}
