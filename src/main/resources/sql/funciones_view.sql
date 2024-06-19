/*  
 *  Historial completo de cursos
   */
DROP FUNCTION IF EXISTS get_historial(bigint);

CREATE
OR REPLACE FUNCTION get_historial(cui_ bigint) RETURNS TABLE (
  codigo bigint,
  nombre text,
  nota1 numeric,
  nota2 numeric,
  nota3 numeric,
  semestre smallint,
  dni_prof bigint,
  prof_nombre text,
  prof_apellido text
) AS $$ 
BEGIN 
  RETURN QUERY
      SELECT MA.codigo_curso, C.nombre, MA.nota1, MA.nota2, MA.nota3, C.semestre, D.dni, D.pnombre, D.papellido
      FROM "matricula" MA, "curso" C, "docente" D
      WHERE cui_ = MA.cui AND Ma.codigo_curso = C.codigo AND C.codigo_doc = D.dni
      ORDER BY C.semestre;
END;
$$ LANGUAGE plpgsql;


/*  
 *  Buscamos los cursos con notas incompletas
 * */
DROP FUNCTION IF EXISTS get_cursos_matriculados (bigint);

CREATE
OR REPLACE FUNCTION get_cursos_matriculados (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  nombre text,
  nota1 numeric,
  nota2 numeric,
  nota3 numeric,
  semestre smallint,
  dni_prof bigint,
  prof_nombre text,
  prof_apellido text
) AS $$ 
BEGIN 
  RETURN QUERY
      SELECT MA.codigo_curso, C.nombre, MA.nota1, MA.nota2, MA.nota3, C.semestre, D.dni, D.pnombre, D.papellido
      FROM "matricula" MA, "curso" C, "docente" D
      WHERE cui_ = MA.cui AND Ma.codigo_curso = C.codigo AND C.codigo_doc = D.dni
      AND ( MA.nota1 = -1 OR MA.nota2 = -1 OR MA.nota3 = -1 );
END;
$$ LANGUAGE plpgsql;

/*
 * Cursos con notas < que 10.5
 */
DROP FUNCTION IF EXISTS get_cursos_reprobados (bigint);

CREATE
OR REPLACE FUNCTION get_cursos_reprobados (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  nombre text,
  nota1 numeric,
  nota2 numeric,
  nota3 numeric,
  semestre smallint,
  dni_prof bigint,
  prof_nombre text,
  prof_apellido text
) AS $$ 
BEGIN 
  RETURN QUERY
      SELECT MA.codigo_curso, C.nombre, MA.nota1, MA.nota2, MA.nota3, C.semestre, D.dni, D.pnombre, D.papellido
      FROM "matricula" MA, "curso" C, "docente" D
      WHERE cui_ = MA.cui AND Ma.codigo_curso = C.codigo AND C.codigo_doc = D.dni
          AND ( MA.nota1 != -1 AND MA.nota2 != -1 AND MA.nota3 != -1 )
          AND (( MA.nota1 + MA.nota2 + MA.nota3 ) / 3.0  < 10.5);
END;
$$ LANGUAGE plpgsql;

/*
 * Cursos con notas >=10.5
 */
DROP FUNCTION IF EXISTS get_cursos_aprobados (bigint);

CREATE
OR REPLACE FUNCTION get_cursos_aprobados (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  nombre text,
  nota1 numeric,
  nota2 numeric,
  nota3 numeric,
  semestre smallint,
  dni_prof bigint,
  prof_nombre text,
  prof_apellido text
) AS $$ 
BEGIN 
  RETURN QUERY
      SELECT MA.codigo_curso, C.nombre, MA.nota1, MA.nota2, MA.nota3, C.semestre, D.dni, D.pnombre, D.papellido
      FROM "matricula" MA, "curso" C, "docente" D
      WHERE cui_ = MA.cui AND Ma.codigo_curso = C.codigo AND C.codigo_doc = D.dni
            AND ( MA.nota1 != -1 AND MA.nota2 != -1 AND MA.nota3 != -1 )
            AND (( MA.nota1 + MA.nota2 + MA.nota3 ) / 3.0  >= 10.5);
END;
$$ LANGUAGE plpgsql;

/*
 * Se consigue el semestre actual, dependiendo de la mayor cantidad de cursos matriculados
 */
DROP FUNCTION IF EXISTS get_semestre (bigint);

CREATE
OR REPLACE FUNCTION get_semestre (cui_ bigint) RETURNS smallint AS $$ 
BEGIN 
  RETURN (
        SELECT semestre FROM(
          SELECT CMAT.semestre, count(*) 
          FROM get_cursos_matriculados (cui_) CMAT 
          GROUP BY CMAT.semestre 
          ORDER BY count DESC FETCH FIRST 1 ROW ONLY
      )
    );
END;
$$ LANGUAGE plpgsql;

/*
 * Se utiliza las notas del ultimo semestre completado
 * *** Se necesita una forma de determinar los cursos
 * llevados en el semestre anterior ***
 */

/*
DROP FUNCTION IF EXISTS get_promedio_semestre (bigint);

CREATE
OR REPLACE function get_promedio_semestre (cui_ bigint) returns decimal AS $$
BEGIN
  RETURN QUERY 
  SELECT 1 FROM alumno;
END;
$$ language plpgsql;

*/

/*
 * Obtenemos promedio de todos los cursos excepto los matriculados
 */
DROP FUNCTION IF EXISTS get_promedio_general(bigint);

CREATE
OR REPLACE function get_promedio_general(cui_ bigint) returns decimal AS $$
BEGIN
  RETURN (
      SELECT AVG((( MA.nota1 + MA.nota2+ MA.nota3 ) /3.0))
      FROM matricula MA 
      WHERE MA.cui = cui_ 
      AND MA.codigo_curso NOT IN (SELECT codigo FROM get_cursos_matriculados(cui_))
    );
END;
$$ language plpgsql;

/*
 * Se consigue cursos que cumplan prerequisitos y semestre no tan algo
 */
DROP FUNCTION IF EXISTS get_cursos_matriculables (bigint);

CREATE
OR REPLACE FUNCTION get_cursos_matriculables (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  nombre text,
  creditos smallint,
  semestre smallint,
  codigo_doc bigint,
  docente_nombre text,
  docente_apellido text
) AS $$ 
BEGIN 
  RETURN QUERY
      SELECT CR.codigo, CR.nombre, CR.creditos, CR.semestre, CR.codigo_doc, DOC.pnombre, DOC.papellido
      FROM curso CR, docente DOC
      WHERE CR.codigo 
      NOT IN( -- Se excluyen aprobados
          SELECT AP.codigo 
          FROM get_cursos_aprobados(cui_) AP
      )
      -- Si se esta por matricular, no se deberia estar llevando cursos
      AND CR.codigo NOT IN( --Se excluyen llevados actualmente
          SELECT MA.codigo 
          FROM get_cursos_matriculados(cui_) MA
        )
      
      AND CR.semestre <= get_semestre(cui_) + 2 -- Semestre no tan elevado
      AND DOC.dni = CR.codigo_doc -- Para datos del docente
      AND ( -- Prerequisito 1
        EXISTS( -- Aprobado
          SELECT 1 
          FROM get_cursos_aprobados(cui_) AP
          WHERE AP.codigo = CR.prerequisito1
        )
        OR EXISTS( -- Lo esta llevando
          SELECT 1 
          FROM get_cursos_matriculados(cui_) AP
          WHERE AP.codigo = CR.prerequisito1
        )
        OR CR.prerequisito1 IS NULL
      )
      AND ( -- Prerequisito 2
        EXISTS( -- Aprobado
          SELECT 1 
          FROM get_cursos_aprobados(cui_) AP
          WHERE AP.codigo = CR.prerequisito2
        ) 
        OR EXISTS( -- Lo esta llevando
          SELECT 1 
          FROM get_cursos_matriculados(cui_) AP
          WHERE AP.codigo = CR.prerequisito2
        )
        OR CR.prerequisito2 IS NULL
      )
      ORDER BY CR.semestre;
END;
$$ LANGUAGE plpgsql;
