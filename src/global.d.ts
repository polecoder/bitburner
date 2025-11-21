/** Datos para la operación coordinada de hackeo, crecimiento y debilitamiento (hgw) */
export interface HGWData {
  /** El número de threads para `hack` */
  hackThreads: number;
  /** El número de threads para `grow` */
  growThreads: number;
  /** El número de threads para `weaken` */
  weakenThreads: number;
  /** El tiempo que tarda en completarse el `hack` (ms) */
  hackTime: number;
  /** El tiempo que tarda en completarse el `grow` (ms) */
  growTime: number;
  /** El tiempo que tarda en completarse el `weaken` (ms) */
  weakenTime: number;
  /** La cantidad total de RAM necesaria para ejecutar el batch */
  ramNeeded: number;
}

/** Resultado de la operación coordinada de hackeo, crecimiento y debilitamiento (hgw) */
export interface HGWResult {
  /** Indica si es posible ejecutar el batch hgw */
  possible: boolean;
  /** Los datos necesarios para ejecutar el batch hgw, o null si no es posible */
  data: HGWData | null;
}

/** Representa un servidor y su valor asociado */
export interface ServerValue {
  /** El nombre del host del servidor */
  hostname: string;
  /** El valor asociado al servidor */
  value: number;
}
