export default function ResumenEstacionamiento({ espacios }) {
  const total = espacios.length;

  const libres = espacios.filter(
    (espacio) => espacio.estado === "libre"
  ).length;

  const ocupados = espacios.filter(
    (espacio) => espacio.estado === "ocupado"
  ).length;

  const sinInformacion = espacios.filter(
    (espacio) =>
      !espacio.estado ||
      !["libre", "ocupado"].includes(espacio.estado)
  ).length;

  const porcentajeDisponible =
    total > 0 ? Math.round((libres / total) * 100) : 0;

  const porcentajeOcupado =
    total > 0 ? Math.round((ocupados / total) * 100) : 0;

  return (
    <section className="summary-grid">

      <article className="summary-card">
        <span className="summary-card__label">
          TOTAL
        </span>

        <strong className="summary-card__value">
          {total}
        </strong>

        <span className="summary-card__description">
          espacios monitoreados
        </span>
      </article>

      <article className="summary-card summary-card--available">
        <span className="summary-card__label">
          DISPONIBLES
        </span>

        <strong className="summary-card__value">
          {libres}
        </strong>

        <span className="summary-card__description">
          {porcentajeDisponible}% del parqueadero
        </span>
      </article>

      <article className="summary-card summary-card--occupied">
        <span className="summary-card__label">
          OCUPADOS
        </span>

        <strong className="summary-card__value">
          {ocupados}
        </strong>

        <span className="summary-card__description">
          {porcentajeOcupado}% del parqueadero
        </span>
      </article>

      <article className="summary-card">
        <span className="summary-card__label">
          DISTRIBUCIÓN
        </span>

        <strong className="summary-card__value">
          4 × 20
        </strong>

        <span className="summary-card__description">
          columnas × espacios
        </span>
      </article>

      {sinInformacion > 0 && (
        <div className="summary-warning">
          {sinInformacion} sensores sin información
        </div>
      )}

    </section>
  );
}