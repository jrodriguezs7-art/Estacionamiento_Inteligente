import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebase";

export function useEspacios() {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const espaciosRef = ref(db, "espacios");

    const cancelar = onValue(
      espaciosRef,
      (snapshot) => {
        const datos = snapshot.val() || {};

        const lista = Object.entries(datos)
          .map(([id, espacio]) => ({
            id,
            ...espacio
          }))
          .sort((a, b) => {
            if (
              Number(a.columna) !==
              Number(b.columna)
            ) {
              return (
                Number(a.columna) -
                Number(b.columna)
              );
            }

            return (
              Number(a.numero) -
              Number(b.numero)
            );
          });

        setEspacios(lista);
        setCargando(false);
      },
      (firebaseError) => {
        console.error(
          "Error leyendo espacios:",
          firebaseError
        );

        setError(firebaseError.message);
        setCargando(false);
      }
    );

    return () => cancelar();
  }, []);

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
      !["libre", "ocupado"].includes(
        espacio.estado
      )
  ).length;

  const porcentajeDisponible =
    total > 0
      ? (libres / total) * 100
      : 0;

  return {
    espacios,
    total,
    libres,
    ocupados,
    sinInformacion,
    porcentajeDisponible,
    cargando,
    error
  };
}