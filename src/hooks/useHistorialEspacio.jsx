import { useEffect, useState } from "react";
import {
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref
} from "firebase/database";

import { db } from "../services/firebase";

export function useHistorialEspacio(id) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setHistorial([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError("");

    const historialRef = query(
      ref(db, `historial/${id}`),
      orderByChild("fechaHora"),
      limitToLast(20)
    );

    const cancelar = onValue(
      historialRef,
      (snapshot) => {
        const datos = snapshot.val() || {};

        const lista = Object.entries(datos)
          .map(([registroId, registro]) => ({
            id: registroId,
            ...registro
          }))
          .sort(
            (a, b) =>
              Number(b.fechaHora || 0) -
              Number(a.fechaHora || 0)
          );

        setHistorial(lista);
        setCargando(false);
      },
      (firebaseError) => {
        console.error(
          "Error leyendo historial:",
          firebaseError
        );

        setError(firebaseError.message);
        setCargando(false);
      }
    );

    return () => cancelar();
  }, [id]);

  return {
    historial,
    cargando,
    error
  };
}