import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo">U</div>

        <div>
          <strong>UTEQ Smart Parking</strong>
          <span>Monitoreo telemático del parqueadero</span>
        </div>
      </div>

      <div className="navbar__links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar__link active" : "navbar__link"
          }
        >
          Resumen
        </NavLink>

        <NavLink
          to="/estacionamiento"
          className={({ isActive }) =>
            isActive ? "navbar__link active" : "navbar__link"
          }
        >
          Parqueadero
        </NavLink>

        <NavLink
          to="/estacionamiento"
          className="navbar__link"
        >
          Geometría
        </NavLink>

        <span className="navbar__live">
          <span className="live-dot"></span>
          RTDB en vivo
        </span>
      </div>
    </nav>
  );
}