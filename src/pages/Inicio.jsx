import { Link } from "react-router-dom";

export default function Inicio() {
  return (
    <main className="home-page">

      <section className="hero">

        <div className="hero__content">

          <span className="hero__eyebrow">
            CAMPUS UTEQ · QUEVEDO
          </span>

          <h1>
            Parqueadero
            <br />
            inteligente
          </h1>

          <p>
            Sistema web para el monitoreo
            telemático de 80 espacios de
            estacionamiento mediante sensores
            ultrasónicos simulados y Firebase
            Realtime Database.
          </p>

          <div className="hero__actions">

            <Link
              to="/estacionamiento"
              className="button button--primary"
            >
              Ver parqueadero
            </Link>

            <a
              href="#informacion"
              className="button button--secondary"
            >
              Conocer el proyecto
            </a>

          </div>

        </div>

        <div className="hero__visual">

          <div className="hero-parking">

            <div className="hero-parking__header">
              <span>UTEQ</span>
              <span>80 ESPACIOS</span>
            </div>

            <div className="hero-parking__grid">

              {Array.from(
                { length: 20 },
                (_, index) => (
                  <div
                    key={index}
                    className={
                      index % 3 === 0
                        ? "hero-space occupied"
                        : "hero-space"
                    }
                  >
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </section>

      <section
        id="informacion"
        className="info-section"
      >

        <div className="section-heading">

          <span className="section-label">
            PROYECTO
          </span>

          <h2>
            Monitoreo inteligente en tiempo real
          </h2>

          <p>
            Cada espacio representa un sensor
            ultrasónico que registra la distancia
            detectada y determina automáticamente
            si el estacionamiento está libre u
            ocupado.
          </p>

        </div>

        <div className="info-grid">

          <article className="info-card">
            <span>01</span>
            <h3>80 sensores</h3>
            <p>
              Cuatro columnas con veinte
              espacios cada una.
            </p>
          </article>

          <article className="info-card">
            <span>02</span>
            <h3>Firebase RTDB</h3>
            <p>
              Actualización de los estados
              en tiempo real.
            </p>
          </article>

          <article className="info-card">
            <span>03</span>
            <h3>Simulación</h3>
            <p>
              Los sensores pueden cambiar
              periódicamente su estado.
            </p>
          </article>

        </div>

      </section>

    </main>
  );
}