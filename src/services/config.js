/**
 * Configuración general del estacionamiento inteligente UTEQ.
 * Centraliza los valores que la guía del proyecto usa en varios
 * lugares (geometría del terreno, umbral de ocupación, columnas)
 * para no repetirlos dentro de cada componente.
 */

// --- Estructura del parqueadero -------------------------------------------
export const TOTAL_COLUMNAS = 4;
export const ESPACIOS_POR_COLUMNA = 20;
export const TOTAL_ESPACIOS = TOTAL_COLUMNAS * ESPACIOS_POR_COLUMNA; // 80

// Letra visible de cada columna (1 => A, 2 => B, 3 => C, 4 => D)
export const LETRAS_COLUMNA = ["A", "B", "C", "D"];

export function letraColumna(columna) {
  return LETRAS_COLUMNA[columna - 1] ?? "?";
}

// Código corto mostrado en la cuadrícula, ej: "A01", "D20"
export function codigoEspacio(columna, numero) {
  return `${letraColumna(columna)}${String(numero).padStart(2, "0")}`;
}

// Identificador usado como llave en Firebase, ej: "ESP-C01-01"
export function idEspacio(columna, numero) {
  return `ESP-C${String(columna).padStart(2, "0")}-${String(numero).padStart(2, "0")}`;
}

// --- Regla de estado del sensor --------------------------------------------
// Si la distancia detectada es <= al umbral, el espacio se considera ocupado.
// Se puede ajustar desde .env con VITE_UMBRAL_OCUPADO_CM (por defecto 50 cm,
// tal como especifica la guía de la práctica).
export const UMBRAL_OCUPADO_CM = Number(
  import.meta.env?.VITE_UMBRAL_OCUPADO_CM ?? 50
);

export function calcularEstado(distanciaDetectada) {
  return distanciaDetectada <= UMBRAL_OCUPADO_CM ? "ocupado" : "libre";
}

// --- Geometría real del terreno (Campus UTEQ, Quevedo) --------------------
// Vértices del polígono que delimita el parqueadero (sentido horario).
export const VERTICES_TERRENO = {
  P1: { latitud: -1.0122617572453996, longitud: -79.4682858877737 },
  P2: { latitud: -1.0125032549290254, longitud: -79.4682998912032 },
  P3: { latitud: -1.012570971500396, longitud: -79.46748620024898 },
  P4: { latitud: -1.0123403901396444, longitud: -79.46746240847104 }
};

// Bounding box general aproximado del parqueadero completo.
export const BOUNDING_BOX_TERRENO = {
  norte: -1.0122617572453996,
  sur: -1.012570971500396,
  oeste: -79.4682998912032,
  este: -79.46746240847104
};

// Dimensiones aproximadas calculadas a partir de las coordenadas (ver guía).
export const GEOMETRIA_TERRENO = {
  largoPromedioM: 91.37,
  anchoPromedioM: 26.34,
  areaAproximadaM2: 2405.74,
  anchoPorColumnaM: 6.58,
  largoPorEspacioM: 4.57,
  areaPorCeldaM2: 30.08,
  espacioSugeridoM: { ancho: 2.5, largo: 5.0 }
};

export const UBICACION_PARQUEADERO = {
  nombre: "Parqueadero Inteligente UTEQ",
  campus: "Campus La María · UTEQ",
  ciudad: "Quevedo",
  provincia: "Los Ríos",
  centro: {
    latitud:
      (BOUNDING_BOX_TERRENO.norte + BOUNDING_BOX_TERRENO.sur) / 2,
    longitud:
      (BOUNDING_BOX_TERRENO.oeste + BOUNDING_BOX_TERRENO.este) / 2
  }
};
