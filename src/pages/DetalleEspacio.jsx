import { Link, useParams } from "react-router-dom";

import { useEspacios } from "../hooks/useEspacios";
import { useHistorialEspacio } from "../hooks/useHistorialEspacio";

import HistorialEspacio from "../components/HistorialEspacio";
import MapaEstacionamiento from "../components/MapaEstacionamiento";

function formatearFecha(timestamp) {
  if (!timestamp) {
    return "Sin información";
  }

  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "America/Guayaquil"
  }).format(
    new Date(timestamp)
  );
}

export default function DetalleEspacio() {
  const { id } = useParams();

  const {
    espacios,
    cargando,
    error
  } = useEspacios();

  const {
    historial,
    cargando: cargandoHistorial,
    error: errorHistorial
  } =
    useHistorialEspacio(id);

  const espacio =
    espacios.find(
      (item) => item.id === id
    );

  if (
    cargando ||
    cargandoHistorial
  ) {
    return (
      <main className="page-container centered">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>
            Cargando información...
          </p>
        </div>
      </main>
    );
  }

  if (error || errorHistorial) {
    return (
      <main className="page-container centered">
        <div className="error-box">
          <h2>
            Error
          </h2>

          <p>
            {error ||
              errorHistorial}
          </p>
        </div>
      </main>
    );
  }

  if (!espacio) {
    return (
      <main className="page-container centered">

        <div className="error-box">

          <h1>
            Espacio no encontrado
          </h1>

          <p>
            No existen datos para:
            <strong> {id}</strong>
          </p>

          <Link
            to="/estacionamiento"
            className="button button--primary"
          >
            Volver al parqueadero
          </Link>

        </div>

      </main>
    );
  }

  const ocupado =
    espacio.estado ===
    "ocupado";

  return (
    <main className="page-container">

      <div className="detail-back">

        <Link to="/estacionamiento">
          ← Volver al parqueadero
        </Link>

      </div>

      <section className="detail-header">

        <div>

          <span className="section-label">
            DETALLE DEL ESPACIO
          </span>

          <div className="detail-title">

            <h1>
              {espacio.columnaNombre}
              {String(
                espacio.numero
              ).padStart(2, "0")}
            </h1>

            <span
              className={
                ocupado
                  ? "badge badge--occupied"
                  : "badge badge--free"
              }
            >
              {ocupado
                ? "OCUPADO"
                : "LIBRE"}
            </span>

          </div>

          <p>
            Parqueadero UTEQ ·
            Columna{" "}
            {espacio.columnaNombre}
            · Espacio{" "}
            {espacio.numero}
          </p>

        </div>

        <div className="detail-current">

          <span>
            DISTANCIA DETECTADA
          </span>

          <strong>
            {Number(
              espacio.distanciaDetectada ||
                0
            ).toFixed(1)}

            <small> cm</small>
          </strong>

        </div>

      </section>

      <section className="detail-grid">

        <div>

          <section className="detail-panel">

            <div className="detail-panel__header">

              <div>
                <span className="section-label">
                  INFORMACIÓN
                </span>

                <h2>
                  Datos del espacio
                </h2>
              </div>

            </div>

            <div className="detail-data-grid">

              <div>
                <span>
                  ID RTDB
                </span>

                <strong>
                  {espacio.id}
                </strong>
              </div>

              <div>
                <span>
                  ESTADO
                </span>

                <strong>
                  {espacio.estado}
                </strong>
              </div>

              <div>
                <span>
                  COLUMNA
                </span>

                <strong>
                  {espacio.columnaNombre}
                </strong>
              </div>

              <div>
                <span>
                  NÚMERO
                </span>

                <strong>
                  {espacio.numero}
                </strong>
              </div>

              <div>
                <span>
                  ÚLTIMA ACTUALIZACIÓN
                </span>

                <strong>
                  {formatearFecha(
                    espacio.fechaHora
                  )}
                </strong>
              </div>

              <div>
                <span>
                  DESCRIPCIÓN
                </span>

                <strong>
                  {
                    espacio.ubicacion
                      ?.descripcion ||
                    "Espacio de estacionamiento UTEQ"
                  }
                </strong>
              </div>

            </div>

          </section>

          <HistorialEspacio
            historial={historial}
          />

        </div>

        <aside>

          <section className="detail-panel">

            <span className="section-label">
              UBICACIÓN
            </span>

            <h2>
              Centro geográfico
            </h2>

            <div className="coordinates-box">

              <div>
                <span>
                  LATITUD
                </span>

                <strong>
                  {
                    espacio.ubicacion
                      ?.latitud
                  }
                </strong>
              </div>

              <div>
                <span>
                  LONGITUD
                </span>

                <strong>
                  {
                    espacio.ubicacion
                      ?.longitud
                  }
                </strong>
              </div>

            </div>

          </section>

          <section className="detail-panel">

            <span className="section-label">
              BOUNDING BOX
            </span>

            <h2>
              Límites del espacio
            </h2>

            <div className="bounding-box">

              <div>
                <span>NORTE</span>
                <strong>
                  {
                    espacio.ubicacion
                      ?.boundingBox
                      ?.norte
                  }
                </strong>
              </div>

              <div>
                <span>SUR</span>
                <strong>
                  {
                    espacio.ubicacion
                      ?.boundingBox
                      ?.sur
                  }
                </strong>
              </div>

              <div>
                <span>OESTE</span>
                <strong>
                  {
                    espacio.ubicacion
                      ?.boundingBox
                      ?.oeste
                  }
                </strong>
              </div>

              <div>
                <span>ESTE</span>
                <strong>
                  {
                    espacio.ubicacion
                      ?.boundingBox
                      ?.este
                  }
                </strong>
              </div>

            </div>

          </section>

        </aside>

      </section>

      <MapaEstacionamiento
        latitud={
          espacio.ubicacion
            ?.latitud
        }
        longitud={
          espacio.ubicacion
            ?.longitud
        }
      />

    </main>
  );
}