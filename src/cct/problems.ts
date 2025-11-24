/**
 * Encuentra el mayor factor primo de un número dado.
 *
 * @param number el número al cual se le quiere encontrar el mayor factor primo
 * @returns
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
