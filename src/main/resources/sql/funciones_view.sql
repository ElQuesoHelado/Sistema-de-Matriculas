/*  
*  Historial de cursos llevados, excluimos matriculados actualmente 
*/
DROP FUNCTION IF EXISTS get_historial (bigint);

CREATE
OR REPLACE FUNCTION get_historial (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  nombre text,
  semestre smallint,
  creditos smallint,
  nota float,
  numero smallint
) AS $$ 
    SELECT MA.codigo_curso, C.nombre, C.semestre, C.creditos, (( MA.nota1 + MA.nota2+ MA.nota3 ) /3.0), MA.numero
    FROM "matricula" MA, "curso" C
    WHERE cui_ = MA.cui AND Ma.codigo_curso = C.codigo
    AND ( MA.nota1 != -1 AND MA.nota2 != -1 AND MA.nota3 != -1 )
    ORDER BY C.semestre;
$$ LANGUAGE SQL STABLE PARALLEL SAFE;

/*
*  Buscamos los cursos con notas incompletas
* */
DROP FUNCTION IF EXISTS get_cursos_matriculados (bigint);

CREATE
OR REPLACE FUNCTION get_cursos_matriculados (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  nombre text,
  semestre smallint,
  creditos smallint,
  prof_nombre text,
  prof_apellido text
) AS $$ 
    SELECT MA.codigo_curso, C.nombre, C.semestre, C.creditos, D.pnombre, D.papellido
    FROM "matricula" MA, "curso" C, "docente" D
    WHERE cui_ = MA.cui AND Ma.codigo_curso = C.codigo AND C.codigo_doc = D.dni
    AND ( MA.nota1 = -1 OR MA.nota2 = -1 OR MA.nota3 = -1 );
$$ LANGUAGE SQL STABLE PARALLEL SAFE;

/*
 * Cursos con notas < que 10.5
 */
DROP FUNCTION IF EXISTS get_cursos_reprobados (bigint);

CREATE
OR REPLACE FUNCTION get_cursos_reprobados (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  semestre smallint,
  creditos smallint
) AS $$ 
    SELECT MA.codigo_curso, C.semestre, C.creditos
    FROM "matricula" MA, "curso" C
    WHERE cui_ = MA.cui AND Ma.codigo_curso = C.codigo
        AND ( MA.nota1 != -1 AND MA.nota2 != -1 AND MA.nota3 != -1 )
        AND (( MA.nota1 + MA.nota2 + MA.nota3 ) / 3.0  < 10.5);
$$ LANGUAGE SQL STABLE PARALLEL SAFE;

/*
 * Cursos con notas >=10.5
 */
DROP FUNCTION IF EXISTS get_cursos_aprobados (bigint);

CREATE
OR REPLACE FUNCTION get_cursos_aprobados (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  semestre smallint,
  creditos smallint
) AS $$ 
    SELECT MA.codigo_curso, C.semestre, C.creditos
    FROM "matricula" MA, "curso" C
    WHERE cui_ = MA.cui AND Ma.codigo_curso = C.codigo
        AND ( MA.nota1 != -1 AND MA.nota2 != -1 AND MA.nota3 != -1 )
        AND (( MA.nota1 + MA.nota2 + MA.nota3 ) / 3.0 >= 10.5);
$$ LANGUAGE SQL STABLE PARALLEL SAFE;

/*
 * Se consigue el semestre actual, dependiendo de la mayor cantidad de cursos matriculados
 */
DROP FUNCTION IF EXISTS get_semestre (bigint);

CREATE
OR REPLACE FUNCTION get_semestre (cui_ bigint) RETURNS smallint AS $$ 
    SELECT semestre FROM(
      SELECT CMAT.semestre, count(*) 
      FROM get_cursos_matriculados (cui_) CMAT 
      GROUP BY CMAT.semestre 
      ORDER BY count DESC FETCH FIRST 1 ROW ONLY) AS semestre;
$$ LANGUAGE SQL STABLE PARALLEL SAFE;

/*
 * Suma de creditos de todos los cursos aprobados
 */
DROP FUNCTION IF EXISTS get_creditos_aprobados(bigint);

CREATE
OR REPLACE FUNCTION get_creditos_aprobados(cui_ bigint) RETURNS smallint AS $$ 
    SELECT SUM(AP.creditos)
    FROM get_cursos_aprobados(cui_) AP
$$ LANGUAGE SQL STABLE PARALLEL SAFE;

/*
 * Suma de creditos de todos los cursos desaprobados 
 */
DROP FUNCTION IF EXISTS get_creditos_reprobados(bigint);

CREATE
OR REPLACE FUNCTION get_creditos_reprobados(cui_ bigint) RETURNS smallint AS $$ 
    SELECT SUM(RP.creditos)
    FROM get_cursos_reprobados(cui_) RP
$$ LANGUAGE SQL STABLE PARALLEL SAFE;

/*
 * Suma de creditos de todos los cursos matriculados 
 */
DROP FUNCTION IF EXISTS get_creditos_matriculados(bigint);

CREATE
OR REPLACE FUNCTION get_creditos_matriculados(cui_ bigint) RETURNS smallint AS $$ 
    SELECT SUM(MA.creditos)
    FROM get_cursos_matriculados(cui_) MA 
$$ LANGUAGE SQL STABLE PARALLEL SAFE;

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
 * Obtenemos todos los promedios, excepto los matriculados
 */
DROP FUNCTION IF EXISTS get_promedios (bigint);

CREATE
OR REPLACE function get_promedios (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  nota1 float,
  nota2 float,
  nota3 float,
  promedio float
) AS $$
  SELECT MA.codigo_curso, MA.nota1, MA.nota2, MA.nota3, (( MA.nota1 + MA.nota2+ MA.nota3 ) / 3.0)
  FROM matricula MA
  WHERE MA.cui = cui_
  AND MA.codigo_curso NOT IN (SELECT codigo FROM get_cursos_matriculados(cui_));
$$ language SQL STABLE PARALLEL SAFE;

/*
 * Obtenemos promedio de todos los cursos excepto los matriculados
 */
DROP FUNCTION IF EXISTS get_promedio_general (bigint);

CREATE
OR REPLACE function get_promedio_general (cui_ bigint) returns float AS $$
    SELECT AVG((( MA.nota1 + MA.nota2+ MA.nota3 ) / 3.0))
    FROM matricula MA 
    WHERE MA.cui = cui_ 
    AND MA.codigo_curso NOT IN (SELECT codigo FROM get_cursos_matriculados(cui_));
$$ LANGUAGE SQL STABLE PARALLEL SAFE;

/*
 * Se consigue cursos que cumplan prerequisitos y semestre no tan algo
 */
DROP FUNCTION IF EXISTS get_cursos_matriculables (bigint);

CREATE
OR REPLACE FUNCTION get_cursos_matriculables (cui_ bigint) RETURNS TABLE (
  codigo bigint,
  nombre text,
  semestre smallint,
  creditos smallint
) AS $$ 
    -- Se precalculan ciertas funciones usadas multiples veces
    WITH aprobados AS(
      SELECT codigo FROM get_cursos_aprobados(cui_)
    ),
    matriculados AS(
        SELECT codigo FROM get_cursos_matriculados(cui_)
    )

    SELECT CR.codigo, CR.nombre, CR.semestre, CR.creditos
    FROM curso CR
    WHERE CR.codigo 
    NOT IN( -- Se excluyen aprobados
        SELECT codigo 
        FROM aprobados
    )
    -- Si se esta por matricular, no se deberia estar llevando cursos
    AND CR.codigo NOT IN( --Se excluyen llevados actualmente
        SELECT codigo 
        FROM matriculados
      )
--    AND CR.semestre <= get_semestre(cui_) + 2 -- Semestre no tan elevado
    AND ( -- Prerequisito 1
      EXISTS( -- Aprobado
        SELECT 1 
        FROM aprobados
        WHERE codigo = CR.prerequisito1
      )
      OR EXISTS( -- Lo esta llevando
        SELECT 1 
        FROM matriculados
        WHERE codigo = CR.prerequisito1
      )
      OR CR.prerequisito1 IS NULL
    )
    AND ( -- Prerequisito 2
      EXISTS( -- Aprobado
        SELECT 1 
        FROM aprobados
        WHERE codigo = CR.prerequisito2
      ) 
      OR EXISTS( -- Lo esta llevando
        SELECT 1 
        FROM matriculados
        WHERE codigo = CR.prerequisito2
      )
      OR CR.prerequisito2 IS NULL
    )
    ORDER BY CR.semestre;
$$ LANGUAGE SQL STABLE PARALLEL SAFE;
