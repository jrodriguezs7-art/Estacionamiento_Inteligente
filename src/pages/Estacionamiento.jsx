import { useEffect, useMemo, useState } from "react";

import ResumenEstacionamiento from "../components/ResumenEstacionamiento";
import CuadriculaEstacionamiento from "../components/CuadriculaEstacionamiento";
import FiltrosEspacios from "../components/FiltrosEspacios";
import MapaEstacionamiento from "../components/MapaEstacionamiento";

import { useEspacios } from "../hooks/useEspacios";

import {
  simularVariosEspacios
} from "../services/simulador";

export default function Estacionamiento() {
  const {
    espacios,
    cargando,
    error
  } = useEspacios();

  const [
    estadoFiltro,
    setEstadoFiltro
  ] = useState("todos");

  const [
    columnaFiltro,
    setColumnaFiltro
  ] = useState("todas");

  const [
    seleccionado,
    setSeleccionado
  ] = useState(null);

  const [
    simulando,
    setSimulando
  ] = useState(false);

  const [
    simulacionAutomatica,
    setSimulacionAutomatica
  ] = useState(false);

  const espaciosFiltrados =
    useMemo(() => {
      return espacios.filter(
        (espacio) => {
          const coincideEstado =
            estadoFiltro === "todos" ||
            espacio.estado ===
              estadoFiltro;

          const columna =
            espacio.columnaNombre ||
            String(
              espacio.columna
            );

          const coincideColumna =
            columnaFiltro ===
              "todas" ||
            columna ===
              columnaFiltro;

          return (
            coincideEstado &&
            coincideColumna
          );
        }
      );
    }, [
      espacios,
      estadoFiltro,
      columnaFiltro
    ]);

  async function ejecutarSimulacion() {
    if (
      simulando ||
      espacios.length === 0
    ) {
      return;
    }

    setSimulando(true);

    try {
      await simularVariosEspacios(
        espacios,
        5
      );
    } catch (error) {
      console.error(
        "Error en simulación:",
        error
      );
    } finally {
      setSimulando(false);
    }
  }

  useEffect(() => {
    if (
      !simulacionAutomatica ||
      espacios.length === 0
    ) {
      return undefined;
    }

    const intervalo =
      setInterval(() => {
        ejecutarSimulacion();
      }, 15000);

    return () =>
      clearInterval(
        intervalo
      );
  }, [
    simulacionAutomatica,
    espacios.length
  ]);

  if (cargando) {
    return (
      <main className="page-container centered">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>
            Cargando espacios...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container centered">
        <div className="error-box">
          <h2>
            Error de conexión
          </h2>

          <p>{error}</p>

          <p>
            Verifica la configuración
            de Firebase y las reglas
            de Realtime Database.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">

      <section className="parking-hero">

        <div>
          <span className="section-label">
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
            eventos desde Firebase
            Realtime Database.
          </p>
        </div>

        <div className="parking-hero__actions">

          <button
            className="button button--primary"
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
            className={
              simulacionAutomatica
                ? "button button--active"
                : "button button--secondary"
            }
            onClick={() =>
              setSimulacionAutomatica(
                (valor) =>
                  !valor
              )
            }
          >
            {simulacionAutomatica
              ? "● Simulación automática"
              : "Activar automática"}
          </button>

          <span className="threshold-text">
            Umbral: ocupado si la
            distancia es ≤ 50 cm
          </span>

        </div>

      </section>

      <ResumenEstacionamiento
        espacios={espacios}
      />

      <section className="operational-grid">

        <div className="operational-main">

          <div className="panel-header">

            <div>
              <span className="section-label">
                VISTA OPERATIVA
              </span>

              <h2>
                Disponibilidad por espacio
              </h2>
            </div>

            <div className="legend">

              <span>
                <i className="legend-dot legend-dot--free"></i>
                Libre
              </span>

              <span>
                <i className="legend-dot legend-dot--occupied"></i>
                Ocupado
              </span>

              <span>
                <i className="legend-dot legend-dot--selected"></i>
                Seleccionado
              </span>

            </div>

          </div>

          <FiltrosEspacios
            estadoFiltro={
              estadoFiltro
            }
            columnaFiltro={
              columnaFiltro
            }
            setEstadoFiltro={
              setEstadoFiltro
            }
            setColumnaFiltro={
              setColumnaFiltro
            }
          />

          <CuadriculaEstacionamiento
            espacios={
              espaciosFiltrados
            }
            seleccionado={
              seleccionado
            }
            onSeleccionar={
              setSeleccionado
            }
          />

        </div>

        <aside className="selected-panel">

          <span className="section-label">
            SENSOR SELECCIONADO
          </span>

          {seleccionado ? (
            <>
              <div className="selected-panel__title">
                <h2>
                  {seleccionado.columnaNombre}
                  {String(
                    seleccionado.numero
                  ).padStart(2, "0")}
                </h2>

                <span
                  className={
                    seleccionado.estado ===
                    "ocupado"
                      ? "badge badge--occupied"
                      : "badge badge--free"
                  }
                >
                  {
                    seleccionado.estado
                  }
                </span>
              </div>

              <div className="selected-distance">
                <span>
                  Distancia detectada
                </span>

                <strong>
                  {Number(
                    seleccionado.distanciaDetectada ||
                      0
                  ).toFixed(0)}
                  <small> cm</small>
                </strong>

                <div className="distance-bar">
                  <span
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          Number(
                            seleccionado.distanciaDetectada ||
                              0
                          ) /
                            3
                        )
                      )}%`
                    }}
                  ></span>
                </div>

                <small>
                  Umbral del sensor:
                  50 cm
                </small>
              </div>

              <div className="selected-data">

                <div>
                  <span>ID RTDB</span>
                  <strong>
                    {seleccionado.id}
                  </strong>
                </div>

                <div>
                  <span>
                    COLUMNA / NÚMERO
                  </span>
                  <strong>
                    {seleccionado.columnaNombre}{" "}
                    /{" "}
                    {seleccionado.numero}
                  </strong>
                </div>

                <div>
                  <span>
                    CENTRO GEOGRÁFICO
                  </span>
                  <strong>
                    {
                      seleccionado
                        .ubicacion
                        ?.latitud
                    }
                    ,{" "}
                    {
                      seleccionado
                        .ubicacion
                        ?.longitud
                    }
                  </strong>
                </div>

              </div>

            </>
          ) : (
            <div className="selected-empty">
              <div className="selected-empty__icon">
                ◉
              </div>

              <h3>
                Selecciona un espacio
              </h3>

              <p>
                Haz clic sobre cualquier
                estacionamiento para
                consultar sus datos.
              </p>
            </div>
          )}

        </aside>

      </section>

      <MapaEstacionamiento />

    </main>
  );
}