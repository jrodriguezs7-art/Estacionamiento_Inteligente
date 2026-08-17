import { useEffect, useMemo, useState } from "react";

import { useEspacios } from "../hooks/useEspacios";
import { useHistorialEspacio } from "../hooks/useHistorialEspacio";
import HistorialEspacio from "../components/HistorialEspacio";

import { simularVariosEspacios } from "../services/simulador";

export default function Estacionamiento() {
  const {
    espacios = [],
    cargando,
    error,
  } = useEspacios();

  const [espacioSeleccionado, setEspacioSeleccionado] =
    useState(null);

  const [filtroEstado, setFiltroEstado] =
    useState("todos");

  const [filtroColumna, setFiltroColumna] =
    useState("todas");

  const [simulando, setSimulando] =
    useState(false);

  const [automatico, setAutomatico] =
    useState(false);

  /*
   * =====================================================
   * HISTORIAL DEL SENSOR SELECCIONADO
   * =====================================================
   */

  const {
    historial,
    cargando: cargandoHistorial,
    error: errorHistorial,
  } = useHistorialEspacio(
    espacioSeleccionado?.id || null
  );

  /*
   * =====================================================
   * SELECCIONAR AUTOMÁTICAMENTE EL PRIMER ESPACIO
   * =====================================================
   */

  useEffect(() => {
    if (
      espacios.length > 0 &&
      !espacioSeleccionado
    ) {
      setEspacioSeleccionado(espacios[0]);
    }
  }, [
    espacios,
    espacioSeleccionado,
  ]);

  /*
   * =====================================================
   * MANTENER ACTUALIZADO EL SENSOR SELECCIONADO
   * =====================================================
   */

  useEffect(() => {
    if (!espacioSeleccionado) {
      return;
    }

    const actualizado =
      espacios.find(
        (espacio) =>
          espacio.id ===
          espacioSeleccionado.id
      );

    if (actualizado) {
      setEspacioSeleccionado(
        actualizado
      );
    }
  }, [espacios]);

  /*
   * =====================================================
   * FILTRADO DE ESPACIOS
   * =====================================================
   */

  const espaciosFiltrados =
    useMemo(() => {
      return espacios.filter(
        (espacio) => {
          /*
           * Filtro por estado
           */
          if (
            filtroEstado ===
            "libres" &&
            espacio.ocupado
          ) {
            return false;
          }

          if (
            filtroEstado ===
            "ocupados" &&
            !espacio.ocupado
          ) {
            return false;
          }

          /*
           * Filtro por columna
           */
          if (
            filtroColumna !==
            "todas"
          ) {
            const columna =
              obtenerColumna(
                espacio
              );

            if (
              columna.toUpperCase() !==
              filtroColumna.toUpperCase()
            ) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      espacios,
      filtroEstado,
      filtroColumna,
    ]);

  /*
   * =====================================================
   * ESTADÍSTICAS
   * =====================================================
   */

  const totalEspacios =
    espacios.length;

  const espaciosOcupados =
    espacios.filter(
      (espacio) =>
        espacio.ocupado === true
    ).length;

  const espaciosDisponibles =
    totalEspacios -
    espaciosOcupados;

  /*
   * =====================================================
   * SELECCIONAR ESPACIO
   * =====================================================
   */

  const seleccionarEspacio =
    (espacio) => {
      setEspacioSeleccionado(
        espacio
      );
    };

  /*
   * =====================================================
   * SIMULAR CAMBIOS
   * =====================================================
   */

  const ejecutarSimulacion =
    async () => {
      if (
        simulando ||
        espacios.length === 0
      ) {
        return;
      }

      try {
        setSimulando(true);

        await simularVariosEspacios(
          espacios,
          1
        );
      } catch (error) {
        console.error(
          "Error al simular cambios:",
          error
        );
      } finally {
        setSimulando(false);
      }
    };

  /*
   * =====================================================
   * SIMULACIÓN AUTOMÁTICA
   * =====================================================
   */

  useEffect(() => {
    if (!automatico) {
      return;
    }

    const intervalo =
      setInterval(() => {
        ejecutarSimulacion();
      }, 5000);

    return () =>
      clearInterval(
        intervalo
      );
  }, [
    automatico,
    espacios,
    simulando,
  ]);

  /*
   * =====================================================
   * ESTADO DE CARGA
   * =====================================================
   */

  if (cargando) {
    return (
      <div className="estacionamiento-page">
        <div className="estado-pagina">
          Cargando estacionamiento...
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * ERROR
   * =====================================================
   */

  if (error) {
    return (
      <div className="estacionamiento-page">
        <div className="estado-pagina error">
          {error}
        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * SENSOR SELECCIONADO
   * =====================================================
   */

  const sensor =
    espacioSeleccionado || {};

  const sensorId =
    sensor.id ||
    sensor.idRtdb ||
    sensor.sensorId ||
    "N/A";

  const distancia =
    sensor.distancia ??
    sensor.distance ??
    0;

  const ocupado =
    sensor.ocupado === true ||
    sensor.estado ===
      "ocupado" ||
    sensor.estado ===
      "OCUPADO";

  const columna =
    obtenerColumna(sensor);

  const numero =
    obtenerNumero(sensor);

  const latitud =
    sensor.latitud ??
    sensor.lat ??
    sensor.latitude ??
    "-";

  const longitud =
    sensor.longitud ??
    sensor.lng ??
    sensor.lon ??
    sensor.longitude ??
    "-";

  const nombreSensor =
    sensor.nombre ||
    sensor.codigo ||
    sensor.espacio ||
    sensorId;

  /*
   * Porcentaje visual de distancia.
   *
   * 50 cm = 100%
   */
  const porcentaje =
    Math.min(
      100,
      Math.max(
        0,
        (Number(distancia) /
          50) *
          100
      )
    );

  return (
    <div className="estacionamiento-page">

      {/* =================================================
          HERO
          ================================================= */}

      <section className="parqueadero-hero">

        <div className="hero-contenido">

          <span className="hero-kicker">
            CAMPUS UTEQ · QUEVEDO
          </span>

          <h1>
            Parqueadero inteligente
          </h1>

          <p>
            Simulación de 80 sensores
            ultrasónicos organizados en
            cuatro columnas. Cada cuadro
            representa un espacio y se
            actualiza como si recibiera
            eventos desde Firebase Realtime
            Database.
          </p>

        </div>

        <div className="hero-acciones">

          <button
            type="button"
            className="btn-principal"
            onClick={
              ejecutarSimulacion
            }
            disabled={simulando}
          >
            {simulando
              ? "Simulando..."
              : "Simular cambios"}
          </button>

          <button
            type="button"
            className={`btn-secundario ${
              automatico
                ? "activo"
                : ""
            }`}
            onClick={() =>
              setAutomatico(
                (actual) =>
                  !actual
              )
            }
          >
            {automatico
              ? "Desactivar automática"
              : "Activar automática"}
          </button>

          <small>
            Umbral: ocupado si la
            distancia es ≤ 50 cm
          </small>

        </div>

      </section>

      {/* =================================================
          ESTADÍSTICAS
          ================================================= */}

      <section className="estadisticas">

        <div className="estadistica">

          <span>
            TOTAL
          </span>

          <strong>
            {totalEspacios}
          </strong>

          <small>
            espacios monitoreados
          </small>

        </div>

        <div className="estadistica">

          <span>
            DISPONIBLES
          </span>

          <strong className="numero-disponible">
            {espaciosDisponibles}
          </strong>

          <small>
            {totalEspacios > 0
              ? Math.round(
                  (espaciosDisponibles /
                    totalEspacios) *
                    100
                )
              : 0}
            % del parqueadero
          </small>

        </div>

        <div className="estadistica">

          <span>
            OCUPADOS
          </span>

          <strong className="numero-ocupado">
            {espaciosOcupados}
          </strong>

          <small>
            {totalEspacios > 0
              ? Math.round(
                  (espaciosOcupados /
                    totalEspacios) *
                    100
                )
              : 0}
            % del parqueadero
          </small>

        </div>

        <div className="estadistica">

          <span>
            DISTRIBUCIÓN
          </span>

          <strong>
            4 × 20
          </strong>

          <small>
            columnas × espacios
          </small>

        </div>

      </section>

      {/* =================================================
          ÁREA PRINCIPAL
          ================================================= */}

      <section className="contenido-parqueadero">

        {/* =================================================
            DISPONIBILIDAD
            ================================================= */}

        <div className="panel-disponibilidad">

          <div className="panel-titulo">

            <div>

              <span className="panel-kicker">
                VISTA OPERATIVA
              </span>

              <h2>
                Disponibilidad por espacio
              </h2>

            </div>

            <div className="leyenda">

              <span>
                <i className="punto libre" />
                Libre
              </span>

              <span>
                <i className="punto ocupado" />
                Ocupado
              </span>

              <span>
                <i className="punto seleccionado" />
                Seleccionado
              </span>

            </div>

          </div>

          {/* =================================================
              FILTROS
              ================================================= */}

          <div className="filtros">

            <div className="filtro-estado">

              <button
                className={
                  filtroEstado ===
                  "todos"
                    ? "filtro activo"
                    : "filtro"
                }
                onClick={() =>
                  setFiltroEstado(
                    "todos"
                  )
                }
              >
                Todos
              </button>

              <button
                className={
                  filtroEstado ===
                  "libres"
                    ? "filtro activo"
                    : "filtro"
                }
                onClick={() =>
                  setFiltroEstado(
                    "libres"
                  )
                }
              >
                Libres
              </button>

              <button
                className={
                  filtroEstado ===
                  "ocupados"
                    ? "filtro activo"
                    : "filtro"
                }
                onClick={() =>
                  setFiltroEstado(
                    "ocupados"
                  )
                }
              >
                Ocupados
              </button>

            </div>

            <div className="filtro-columnas">

              <button
                className={
                  filtroColumna ===
                  "todas"
                    ? "columna activo"
                    : "columna"
                }
                onClick={() =>
                  setFiltroColumna(
                    "todas"
                  )
                }
              >
                Todas
              </button>

              {[
                "A",
                "B",
                "C",
                "D",
              ].map(
                (col) => (
                  <button
                    key={col}
                    className={
                      filtroColumna ===
                      col
                        ? "columna activo"
                        : "columna"
                    }
                    onClick={() =>
                      setFiltroColumna(
                        col
                      )
                    }
                  >
                    {col}
                  </button>
                )
              )}

            </div>

          </div>

          {/* =================================================
              GRID DE 80 ESPACIOS
              ================================================= */}

          <div className="parqueadero-grid">

            <div className="entrada">
              ENTRADA
              <span>
                — — — — — — — —
              </span>
            </div>

            <div className="columnas-titulos">

              <span>
                COLUMNA A
              </span>

              <span>
                COLUMNA B
              </span>

              <span>
                COLUMNA C
              </span>

              <span>
                COLUMNA D
              </span>

            </div>

            <div className="espacios-grid">

              {espaciosFiltrados.map(
                (
                  espacio,
                  index
                ) => {

                  const seleccionado =
                    espacioSeleccionado?.id ===
                    espacio.id;

                  const ocupadoActual =
                    espacio.ocupado ===
                    true;

                  const id =
                    espacio.id ||
                    `ESP-${index + 1}`;

                  const distanciaActual =
                    espacio.distancia ??
                    espacio.distance ??
                    "--";

                  const columnaActual =
                    obtenerColumna(
                      espacio
                    );

                  const numeroActual =
                    obtenerNumero(
                      espacio
                    );

                  return (
                    <button
                      type="button"
                      key={id}
                      className={`espacio-card ${
                        ocupadoActual
                          ? "espacio-ocupado"
                          : "espacio-libre"
                      } ${
                        seleccionado
                          ? "espacio-seleccionado"
                          : ""
                      }`}
                      onClick={() =>
                        seleccionarEspacio(
                          espacio
                        )
                      }
                    >

                      <div className="espacio-superior">

                        <strong>
                          {columnaActual}
                          {numeroActual}
                        </strong>

                        <span>
                          {ocupadoActual
                            ? "OCUPADO"
                            : "LIBRE"}
                        </span>

                      </div>

                      <div className="espacio-centro">

                        <div className="sensor-icon">
                          ◉
                        </div>

                        <strong>
                          {distanciaActual}
                          <small>
                            cm
                          </small>
                        </strong>

                      </div>

                      <div className="espacio-inferior">

                        <span>
                          Espacio{" "}
                          {numeroActual}
                        </span>

                        <span>
                          {ocupadoActual
                            ? "Vehículo detectado"
                            : "Disponible"}
                        </span>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

          </div>

        </div>

        {/* =================================================
            SENSOR SELECCIONADO
            ================================================= */}

        <aside className="panel-sensor">

          <div className="sensor-cabecera">

            <span className="panel-kicker">
              SENSOR SELECCIONADO
            </span>

            <div className="sensor-titulo">

              <h2>
                {nombreSensor}
              </h2>

              <span
                className={
                  ocupado
                    ? "badge-ocupado"
                    : "badge-libre"
                }
              >
                {ocupado
                  ? "OCUPADO"
                  : "LIBRE"}
              </span>

            </div>

          </div>

          {/* =================================================
              DISTANCIA
              ================================================= */}

          <div className="distancia-panel">

            <span>
              Distancia detectada
            </span>

            <div className="distancia-numero">

              <strong>
                {distancia}
              </strong>

              <small>
                cm
              </small>

            </div>

            <div className="barra-distancia">

              <div
                style={{
                  width: `${porcentaje}%`,
                }}
              />

            </div>

            <small>
              Umbral del sensor: 50 cm
            </small>

          </div>

          {/* =================================================
              INFORMACIÓN
              ================================================= */}

          <div className="informacion-sensor">

            <div>
              <span>
                ID RTDB
              </span>

              <strong>
                {sensorId}
              </strong>
            </div>

            <div>
              <span>
                COLUMNA / NÚMERO
              </span>

              <strong>
                {columna} / {numero}
              </strong>
            </div>

            <div>
              <span>
                CENTRO GEOGRÁFICO
              </span>

              <strong>
                {latitud},{" "}
                {longitud}
              </strong>
            </div>

          </div>

          {/* =================================================
              HISTORIAL
              ================================================= */}

          <HistorialEspacio
            historial={historial}
            cargando={
              cargandoHistorial
            }
            error={
              errorHistorial
            }
          />

        </aside>

      </section>

    </div>
  );
}


/*
 * =====================================================
 * FUNCIONES AUXILIARES
 * =====================================================
 */

function obtenerColumna(
  espacio
) {
  if (
    espacio.columna !==
    undefined
  ) {
    return String(
      espacio.columna
    ).toUpperCase();
  }

  if (
    espacio.col !==
    undefined
  ) {
    return String(
      espacio.col
    ).toUpperCase();
  }

  if (
    espacio.column !==
    undefined
  ) {
    return String(
      espacio.column
    ).toUpperCase();
  }

  /*
   * Intentamos obtener la columna
   * desde el ID.
   *
   * Ejemplo:
   * ESP-C04-04
   *       ↑
   *       C
   */

  const id =
    espacio.id ||
    espacio.idRtdb ||
    "";

  const coincidencia =
    String(id).match(
      /ESP-([A-D])/i
    );

  if (coincidencia) {
    return coincidencia[1]
      .toUpperCase();
  }

  /*
   * Si no existe columna,
   * utilizamos la posición.
   */

  return "-";
}


function obtenerNumero(
  espacio
) {
  if (
    espacio.numero !==
    undefined
  ) {
    return espacio.numero;
  }

  if (
    espacio.num !==
    undefined
  ) {
    return espacio.num;
  }

  if (
    espacio.number !==
    undefined
  ) {
    return espacio.number;
  }

  const id =
    espacio.id ||
    espacio.idRtdb ||
    "";

  /*
   * Ejemplo:
   * ESP-C04-04
   *          ↑
   *          04
   */

  const coincidencia =
    String(id).match(
      /ESP-[A-D](\d+)/i
    );

  if (coincidencia) {
    return Number(
      coincidencia[1]
    );
  }

  return "-";
}