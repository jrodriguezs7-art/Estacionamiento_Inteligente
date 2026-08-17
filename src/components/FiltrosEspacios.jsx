export default function FiltrosEspacios({
  estadoFiltro,
  columnaFiltro,
  setEstadoFiltro,
  setColumnaFiltro
}) {
  return (
    <div className="filters">

      <div className="filter-group">

        <button
          className={
            estadoFiltro === "todos"
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() => setEstadoFiltro("todos")}
        >
          Todos
        </button>

        <button
          className={
            estadoFiltro === "libre"
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() => setEstadoFiltro("libre")}
        >
          Libres
        </button>

        <button
          className={
            estadoFiltro === "ocupado"
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() => setEstadoFiltro("ocupado")}
        >
          Ocupados
        </button>

      </div>

      <div className="filter-group">

        <button
          className={
            columnaFiltro === "todas"
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() => setColumnaFiltro("todas")}
        >
          Todas
        </button>

        {["A", "B", "C", "D"].map((columna) => (
          <button
            key={columna}
            className={
              columnaFiltro === columna
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => setColumnaFiltro(columna)}
          >
            {columna}
          </button>
        ))}

      </div>

    </div>
  );
}