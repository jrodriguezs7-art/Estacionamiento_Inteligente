import {
  get,
  push,
  ref,
  update,
} from "firebase/database";

import { db } from "./firebase";

function numeroAleatorio(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function generarDistancia(estado) {
  if (estado === "ocupado") {
    return numeroAleatorio(25, 49);
  }

  return numeroAleatorio(120, 280);
}

function calcularEstado(distancia) {
  return distancia <= 50
    ? "ocupado"
    : "libre";
}

export async function simularCambioEspacio(
  espacio
) {
  if (!espacio?.id) {
    throw new Error(
      "No se proporcionó un espacio válido."
    );
  }

  const espacioId = espacio.id;

  /*
   * Alternamos el estado actual para que
   * sea visible el cambio.
   */
  const nuevoEstado =
    espacio.estado === "ocupado"
      ? "libre"
      : "ocupado";

  const distanciaDetectada =
    generarDistancia(nuevoEstado);

  const estado =
    calcularEstado(distanciaDetectada);

  const timestamp = Date.now();

  /*
   * Nuevo registro histórico.
   */
  const historialRef = ref(
    db,
    `historial/${espacioId}`
  );

  const nuevoEventoRef = push(
    historialRef
  );

  /*
   * Actualización múltiple:
   *
   * espacios/{id}/distanciaDetectada
   * espacios/{id}/estado
   * espacios/{id}/fechaHora
   *
   * historial/{id}/{pushId}
   */
  const cambios = {
    [`espacios/${espacioId}/distanciaDetectada`]:
      distanciaDetectada,

    [`espacios/${espacioId}/estado`]:
      estado,

    [`espacios/${espacioId}/fechaHora`]:
      timestamp,

    [`historial/${espacioId}/${nuevoEventoRef.key}`]: {
      distanciaDetectada,
      estado,
      timestamp,
      fechaHora: timestamp,
    },
  };

  await update(ref(db), cambios);

  return {
    espacioId,
    distanciaDetectada,
    estado,
    timestamp,
  };
}

export async function simularVariosEspacios(
  espacios,
  cantidad = 4
) {
  if (!Array.isArray(espacios)) {
    return;
  }

  if (espacios.length === 0) {
    return;
  }

  const copia = [...espacios];

  /*
   * Mezclamos los espacios.
   */
  copia.sort(() => Math.random() - 0.5);

  const seleccionados = copia.slice(
    0,
    Math.min(cantidad, copia.length)
  );

  const resultados = [];

  for (const espacio of seleccionados) {
    try {
      const resultado =
        await simularCambioEspacio(
          espacio
        );

      resultados.push(resultado);
    } catch (error) {
      console.error(
        `Error simulando ${espacio.id}:`,
        error
      );
    }
  }

  return resultados;
}

/*
 * Esta función permite inicializar historial
 * si un espacio no tiene ningún evento.
 *
 * Es útil si importaste un JSON que contiene
 * espacios pero no historial.
 */
export async function crearHistorialInicial(
  espacio,
  cantidad = 9
) {
  if (!espacio?.id) {
    throw new Error(
      "Espacio inválido."
    );
  }

  const espacioId = espacio.id;

  const historialActual = await get(
    ref(db, `historial/${espacioId}`)
  );

  /*
   * Si ya existe historial no hacemos nada.
   */
  if (historialActual.exists()) {
    return false;
  }

  const eventos = {};

  const estadoActual =
    espacio.estado === "ocupado"
      ? "ocupado"
      : "libre";

  /*
   * Generamos 9 eventos históricos.
   */
  for (let i = cantidad - 1; i >= 0; i--) {

    const timestamp =
      Date.now() -
      i * 5 * 60 * 1000;

    /*
     * Algunos eventos libres y otros ocupados
     * para que la vista se parezca a la referencia.
     */
    let estado;

    if (i === 0) {
      estado = estadoActual;
    } else {
      estado =
        Math.random() > 0.55
          ? "ocupado"
          : "libre";
    }

    const distancia =
      generarDistancia(estado);

    const key = String(timestamp);

    eventos[
      `historial/${espacioId}/${key}`
    ] = {
      distanciaDetectada: distancia,
      estado,
      timestamp,
      fechaHora: timestamp,
    };
  }

  await update(ref(db), eventos);

  return true;
}