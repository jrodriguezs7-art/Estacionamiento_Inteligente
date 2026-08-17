import {
  ref,
  update
} from "firebase/database";

import { db } from "./firebase";

const UMBRAL_OCUPADO = 50;

function generarDistancia(estadoActual) {
  const aleatorio =
    Math.random();

  if (estadoActual === "ocupado") {
    if (aleatorio < 0.70) {
      return Number(
        (
          20 +
          Math.random() * 28
        ).toFixed(1)
      );
    }

    return Number(
      (
        55 +
        Math.random() * 80
      ).toFixed(1)
    );
  }

  if (aleatorio < 0.75) {
    return Number(
      (
        80 +
        Math.random() * 180
      ).toFixed(1)
    );
  }

  return Number(
    (
      20 +
      Math.random() * 28
    ).toFixed(1)
  );
}

function obtenerEstado(distancia) {
  return distancia <= UMBRAL_OCUPADO
    ? "ocupado"
    : "libre";
}

export async function simularEspacio(
  espacio
) {
  if (!espacio?.id) {
    throw new Error(
      "El espacio no es válido."
    );
  }

  const distancia =
    generarDistancia(
      espacio.estado
    );

  const estado =
    obtenerEstado(distancia);

  const fechaHora =
    Date.now();

  const historialId =
    String(fechaHora);

  const cambios = {};

  cambios[
    `espacios/${espacio.id}/distanciaDetectada`
  ] = distancia;

  cambios[
    `espacios/${espacio.id}/estado`
  ] = estado;

  cambios[
    `espacios/${espacio.id}/fechaHora`
  ] = fechaHora;

  cambios[
    `historial/${espacio.id}/${historialId}`
  ] = {
    distanciaDetectada:
      distancia,

    estado,

    fechaHora
  };

  await update(
    ref(db),
    cambios
  );

  return {
    distancia,
    estado,
    fechaHora
  };
}

export async function simularVariosEspacios(
  espacios,
  cantidad = 5
) {
  if (
    !Array.isArray(espacios) ||
    espacios.length === 0
  ) {
    return [];
  }

  const copia = [
    ...espacios
  ];

  copia.sort(
    () =>
      Math.random() -
      0.5
  );

  const seleccionados =
    copia.slice(
      0,
      Math.min(
        cantidad,
        copia.length
      )
    );

  const resultados = [];

  for (const espacio of seleccionados) {
    try {
      const resultado =
        await simularEspacio(
          espacio
        );

      resultados.push({
        id: espacio.id,
        ...resultado
      });
    } catch (error) {
      console.error(
        `Error simulando ${espacio.id}:`,
        error
      );
    }
  }

  return resultados;
}