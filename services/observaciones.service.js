import db from "../config/db.js";

//crear
export const crearObservacion = async (data) => {

  if (data.descripcion.trim().length < 10) {
    throw new Error("Descripción muy corta");
  }

  const [validacion] = await db.query(`
    SELECT COUNT(*) as total
    FROM instructor_grupo ig
    JOIN aprendiz_grupo ag ON ig.id_grupo = ag.id_grupo
    WHERE ig.id_instructor = ?
      AND ag.id_aprendiz = ?
      AND ig.estado = 'ACTIVO'
      AND ag.estado = 'ACTIVO'
  `, [data.id_instructor, data.id_aprendiz]);

  if (validacion[0].total === 0) {
    throw new Error("No tienes permiso sobre este aprendiz");
  }

  await db.query(`
    INSERT INTO observaciones
    (id_aprendiz, id_instructor, tipo_observacion, severidad, descripcion)
    VALUES (?, ?, ?, ?, ?)
  `, [
    data.id_aprendiz,
    data.id_instructor,
    data.tipo_observacion,
    data.severidad,
    data.descripcion
  ]);
};


//consultar
export const obtenerObservaciones = async (filtros) => {

  let query = `
    SELECT 
      o.*,
      p.nombres,
      p.apellidos
    FROM observaciones o
    JOIN aprendices a ON o.id_aprendiz = a.id_aprendiz
    JOIN personas p ON a.id_usuario = p.id_usuario
    JOIN aprendiz_grupo ag ON a.id_aprendiz = ag.id_aprendiz
    JOIN instructor_grupo ig ON ag.id_grupo = ig.id_grupo
    WHERE ig.id_instructor = ?
  `;

  let params = [filtros.id_instructor];

  if (filtros.id_aprendiz) {
    query += " AND o.id_aprendiz = ?";
    params.push(filtros.id_aprendiz);
  }

  if (filtros.tipo) {
    query += " AND o.tipo_observacion = ?";
    params.push(filtros.tipo);
  }

  if (filtros.fecha_inicio && filtros.fecha_fin) {
    query += " AND DATE(o.fecha_observacion) BETWEEN ? AND ?";
    params.push(filtros.fecha_inicio, filtros.fecha_fin);
  }

  query += " ORDER BY o.fecha_observacion DESC";

  const [rows] = await db.query(query, params);
  return rows;
};
