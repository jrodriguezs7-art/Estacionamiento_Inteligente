function formatearFecha(timestamp) {
  if (!timestamp) {
    return "Sin información";
  }

  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "America/Guayaquil"
  }).format(new Date(timestamp));
}

export default function HistorialEspacio({
  historial
}) {
  if (!historial || historial.length === 0) {
    return (
      <section className="detail-panel">
        <div className="detail-panel__header">
          <div>
            <span className="section-label">
              HISTORIAL
            </span>

            <h2>Historial reciente</h2>
          </div>
        </div>

        <div className="empty-state">
          No existen registros históricos.
        </div>
      </section>
    );
  }

  return (
    <section className="detail-panel">

      <div className="detail-panel__header">
        <div>
          <span className="section-label">
            HISTORIAL
          </span>

          <h2>Historial reciente</h2>
        </div>

        <span className="history-count">
          {historial.length} eventos
        </span>
      </div>

      <div className="history-list">

        {historial.map((registro) => {

          const ocupado =
            registro.estado === "ocupado";

          return (
            <div
              className="history-item"
              key={registro.id}
            >

              <span
                className={
                  ocupado
                    ? "history-dot history-dot--occupied"
                    : "history-dot history-dot--free"
                }
              ></span>

              <div className="history-content">

                <strong>
                  {ocupado
                    ? "Ocupado"
                    : "Libre"}
                </strong>

                <span>
                  {formatearFecha(
                    registro.fechaHora ||
                    registro.timestamp
                  )}
                </span>

              </div>

              <strong className="history-distance">
                {registro.distanciaDetectada !==
                  undefined &&
                registro.distanciaDetectada !== null
                  ? `${Number(
                      registro.distanciaDetectada
                    ).toFixed(0)} cm`
                  : "--"}
              </strong>

            </div>
          );
        })}

      </div>

    </section>
  );
}