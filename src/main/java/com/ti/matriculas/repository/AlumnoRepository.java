package com.ti.matriculas.repository;

import java.util.List;

import com.ti.matriculas.entity.Alumno;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
                                
public interface AlumnoRepository extends CrudRepository<Alumno,Integer> {
    Alumno findById(int id);

    @Query(nativeQuery = true, value = "SELECT * FROM get_historial(:id) ")
    List<CursoNotas> get_historial(int id);

    @Query(nativeQuery = true, value = "SELECT * FROM get_cursos_matriculados(:id) ")
    List<CursoDocente> get_cursos_matriculados(int id);

    @Query(nativeQuery = true, value = "SELECT * FROM get_cursos_matriculables(:id) ")
    List<Curso> get_cursos_matriculables(int id);

    @Query(nativeQuery = true, value = "SELECT get_semestre(:id) ")
    Integer get_semestre(int id);

    @Query(nativeQuery = true, value = "SELECT get_promedio_general(:id) ")
    Float get_promedio_general(int id);

    @Query(nativeQuery = true, value = "SELECT get_creditos_aprobados(:id) ")
    Integer get_creditos_aprobados(int id);

    @Query(nativeQuery = true, value = "SELECT get_creditos_reprobados(:id) ")
    Integer  get_creditos_reprobados(int id);

    @Query(nativeQuery = true, value = "SELECT get_creditos_matriculados(:id) ")
    Integer get_creditos_matriculados(int id);

    //@Query(nativeQuery = true, value = "SELECT * FROM get_cursos_aprobados(:id) ")
    //List<Curso> get_cursos_aprobados(int id);
    //
    //@Query(nativeQuery = true, value = "SELECT * FROM get_cursos_reprobados(:id) ")
    //List<Curso> get_cursos_reprobados(int id);
    //
    //@Query(nativeQuery = true, value = "SELECT * FROM get_promedios(:id) ")
    //List<CursoPromedio> get_promedios(int id);

    //Con proyeccion, aparentemente es lento
    // TODO: ?? Cambio a otra forma mas rapida ??
    public static interface Curso {
        int getCodigo();
        String getNombre();
        int getSemestre();
        int getCreditos();
    }

    public static interface CursoNotas extends Curso{
        int getNota();
        int getNumero();
    }

    public static interface CursoDocente extends Curso{
        String getProf_nombre();
        String getProf_apellido();
    }
}
