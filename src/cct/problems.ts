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
