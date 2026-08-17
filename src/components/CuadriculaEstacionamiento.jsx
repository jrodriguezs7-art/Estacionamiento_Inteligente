import EspacioCard from "./EspacioCard";

const columnas = [
  {
    numero: 1,
    nombre: "A"
  },
  {
    numero: 2,
    nombre: "B"
  },
  {
    numero: 3,
    nombre: "C"
  },
  {
    numero: 4,
    nombre: "D"
  }
];

export default function CuadriculaEstacionamiento({
  espacios,
  seleccionado,
  onSeleccionar
}) {
  return (
    <section className="parking-layout">

      <div className="parking-entry">
        <span>ENTRADA</span>

        <div className="parking-entry__line"></div>
        <div className="parking-entry__line"></div>
        <div className="parking-entry__line"></div>
      </div>

      <div className="parking-columns">

        {columnas.map((columna) => {
          const espaciosColumna = espacios
            .filter(
              (espacio) =>
                Number(espacio.columna) === columna.numero
            )
            .sort(
              (a, b) => Number(a.numero) - Number(b.numero)
            );

          return (
            <div
              className="parking-column"
              key={columna.numero}
            >
              <div className="parking-column__title">
                COLUMNA {columna.nombre}
              </div>

              <div className="parking-column__spaces">
                {espaciosColumna.map((espacio) => (
                  <EspacioCard
                    key={espacio.id}
                    espacio={espacio}
                    seleccionado={
                      seleccionado?.id === espacio.id
                    }
                    onSeleccionar={onSeleccionar}
                  />
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}