package com.ti.matriculas.repository;

import java.util.List;

import com.ti.matriculas.entity.Alumno;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;

public interface AlumnoRepository extends CrudRepository<Alumno,Integer> {
    Alumno findById(int id);

    @Query(nativeQuery = true,value = "SELECT * FROM get_cursos_aprobados(:id) ")
    List<CursoAprobado> get_cursos_aprobados(int id);

    @Query(nativeQuery = true,value = "SELECT * FROM get_cursos_matriculables(:id) ")
    List<CursoMatriculable> get_cursos_matriculables(int id);

    //Con proyeccion, aparentemente es lento
    public static interface CursoAprobado{
        int getCodigo();
        String getNombre();
        int getNota1();
        int getNota2();
        int getNota3();
        int getDni_prof();
        String getProf_nombre();
        String getProf_apellido();
    }

    public static interface CursoMatriculable{
        int getCodigo();
        String getNombre();
        int getCreditos();
        int getSemestre();
        int getCodigo_doc();
        String getDocente_nombre();
        String getDocente_apellido();
    }
}
