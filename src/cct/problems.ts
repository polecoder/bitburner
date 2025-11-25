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
   * @param memo un mapa para almacenar resultados intermedios y evitar cálculos repetidos
   * @returns el número de formas de sumar `number` usando sumandos hasta `maxAddend`
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

    const result =
      countWays(number, maxAddend - 1, memo) +
      countWays(number - maxAddend, maxAddend, memo);

    memo.set(key, result);
    return result;
  }

  // usamos n-1 como máximo para excluir automáticamente "n solo"
  return countWays(number, number - 1);
}

/**
 * Calcula el número total de formas en que un número dado puede ser expresado como la suma de números enteros positivos tomados de un conjunto especificado por el parámetro `data`.
 *
 * @param number el número del cual se quieren contar las formas de ser sumado
 * @param data el conjunto de números enteros positivos que se pueden usar como sumandos
 * @returns
 */
export function totalWaysToSumII(number: number, data: number[]): number {
  /**
   * Cuenta las formas de sumar `number` usando sumandos del array `numberPool`.
   * Guarda los resultados intermedios en un mapa `memo` para evitar cálculos repetidos (programación dinámica con memoización).
   * Función auxiliar recursiva.
   *
   * @param number el número del que se quieren contar las formas de sumar
   * @param numberPool el conjunto de sumandos permitidos en la suma
   * @param memo un mapa para almacenar resultados intermedios y evitar cálculos repetidos
   * @returns
   */
  function countWays(
    number: number,
    numberPool: number[],
    memo: Map<string, number> = new Map<string, number>()
  ): number {
    if (number === 0) return 1; // una forma de sumar 0: no usar sumandos
    if (number < 0 || numberPool.length === 0) return 0; // no hay formas de sumar un número negativo o si no hay sumandos disponibles

    // nos fijamos si ya tenemos el resultado en el memo
    const key = `${number}-${numberPool.join(",")}`;
    if (memo.has(key)) return memo.get(key) as number;

    // obtengo el resultado, sumando las formas de contar usando el primer número del pool y sin usarlo
    const result =
      countWays(number, numberPool.slice(1), memo) +
      countWays(number - numberPool[0], numberPool, memo);

    memo.set(key, result);
    return result;
  }

  // ordenamos el array de mayor a menor
  data = data.sort((a, b) => b - a);

  return countWays(number, data);
}

/**
 * Recorre una matriz en espiral y devuelve un array con los elementos en el orden recorrido.
 *
 * @param matrix la matriz a recorrer en espiral
 * @returns un array con los elementos de la matriz en el orden recorrido en espiral
 */
export function spiralizeMatrix(matrix: number[][]): number[] {
  const result: number[] = [];
  const totalCells = matrix.length * matrix[0].length;

  const rowLength = matrix[0].length;
  const columnLength = matrix.length;

  let top = 0;
  let bottom = columnLength - 1;
  let left = 0;
  let right = rowLength - 1;

  while (result.length < totalCells) {
    // recorrer fila superior
    for (let col = left; col <= right; col++) {
      if (result.length >= totalCells) break; // salgo si ya llené el array resultado
      result.push(matrix[top][col]);
    }
    // recorrer columna derecha
    for (let row = top + 1; row <= bottom; row++) {
      if (result.length >= totalCells) break; // salgo si ya llené el array resultado
      result.push(matrix[row][right]);
    }
    // recorrer fila inferior
    for (let col = right - 1; col >= left; col--) {
      if (result.length >= totalCells) break; // salgo si ya llené el array resultado
      result.push(matrix[bottom][col]);
    }
    // recorrer columna izquierda
    for (let row = bottom - 1; row > top; row--) {
      if (result.length >= totalCells) break; // salgo si ya llené el array resultado
      result.push(matrix[row][left]);
    }
    top++;
    bottom--;
    left++;
    right--;
  }

  return result;
}
