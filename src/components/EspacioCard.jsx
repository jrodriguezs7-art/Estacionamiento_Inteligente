import { Link } from "react-router-dom";

function formatearFecha(timestamp) {
  if (!timestamp) {
    return "Sin información";
  }

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Guayaquil"
  }).format(new Date(timestamp));
}

export default function EspacioCard({
  espacio,
  seleccionado,
  onSeleccionar
}) {
  if (!espacio) {
    return null;
  }

  const estado = espacio.estado || "sin-informacion";

  const claseEstado =
    estado === "libre"
      ? "space-card space-card--libre"
      : estado === "ocupado"
        ? "space-card space-card--ocupado"
        : "space-card space-card--sin-info";

  return (
    <article
      className={`${claseEstado} ${
        seleccionado ? "space-card--selected" : ""
      }`}
      onClick={() => onSeleccionar?.(espacio)}
    >
      <div className="space-card__top">
        <span className="space-card__id">
          {espacio.columnaNombre || `C${espacio.columna}`}
          {String(espacio.numero).padStart(2, "0")}
        </span>

        <span className="space-card__status">
          {estado === "libre"
            ? "Libre"
            : estado === "ocupado"
              ? "Ocupado"
              : "Sin info"}
        </span>
      </div>

      <div className="space-card__sensor">
        <div className="sensor-icon">
          <span></span>
        </div>

        <div className="sensor-distance">
          {espacio.distanciaDetectada !== undefined &&
          espacio.distanciaDetectada !== null
            ? `${Number(espacio.distanciaDetectada).toFixed(0)} cm`
            : "--"}
        </div>
      </div>

      <div className="space-card__footer">
        <span>
          Espacio {espacio.numero}
        </span>

        <span>
          {formatearFecha(espacio.fechaHora)}
        </span>
      </div>

      <Link
        className="space-card__detail"
        to={`/espacios/${espacio.id}`}
        onClick={(event) => event.stopPropagation()}
      >
        Ver detalle →
      </Link>
    </article>
  );
}