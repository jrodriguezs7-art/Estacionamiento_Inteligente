export default function MapaEstacionamiento({
  latitud = -1.012416593,
  longitud = -79.467874
}) {
  const delta = 0.001;

  const bbox = [
    longitud - delta,
    latitud - delta,
    longitud + delta,
    latitud + delta
  ].join(",");

  const mapaUrl =
    `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitud},${longitud}`;

  return (
    <section className="map-panel">

      <div className="map-panel__header">
        <div>
          <span className="section-label">
            UBICACIÓN
          </span>

          <h2>Parqueadero UTEQ</h2>
        </div>

        <span className="map-coordinate">
          {latitud.toFixed(6)}, {longitud.toFixed(6)}
        </span>
      </div>

      <div className="map-container">
        <iframe
          title="Ubicación del estacionamiento UTEQ"
          src={mapaUrl}
          loading="lazy"
        ></iframe>
      </div>

    </section>
  );
}