package com.ti.matriculas.controllers;


import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;

@Controller
public class MatricularController {
    private final AlumnoRepository repository;
    private final AlumnoRepository alumnoRepository;

    @Autowired
    public MatricularController(AlumnoRepository repository, AlumnoRepository alumnoRepository) {
        this.repository = repository;
        this.alumnoRepository = alumnoRepository;
    }

    @GetMapping("/matricular")
    public String matricular() {
//        return "testMatricular.html";
        return "";
    }

    @PostMapping("/matricular")
    public ResponseEntity<?> matricular(@RequestBody List<Integer> codigosCursosCandidatos, Model model) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        int cui = Integer.parseInt(username);

        //Necesitamos revisar si los cursos listados en JSON son validos
        List<AlumnoRepository.Curso> listaCursosMatriculables = repository.get_cursos_matriculables(cui);
        List<AlumnoRepository.CursoReprobado> listaCursosReprobados = repository.get_cursos_reprobados(cui);

        // TODO: REVISAR SI ASI SE CONSIDERA EL CREDITAJE MAXIMO
        int creditos = 0, minCreditos = 22, maxCreditos = 26;
        if (!listaCursosReprobados.isEmpty()) {
            minCreditos = 1;
            maxCreditos = 18;
        }

        //Tablas hash para busquedas rapidas
        Hashtable<Integer, Integer> codigoNumeroMatriculables = new Hashtable<>();
        for (AlumnoRepository.Curso curso : listaCursosMatriculables) {
            codigoNumeroMatriculables.put(curso.getCodigo(), curso.getCreditos());
        }

        Hashtable<Integer, Integer> codigoNumeroReprobados = new Hashtable<>();
        for (AlumnoRepository.CursoReprobado curso : listaCursosReprobados) {
            codigoNumeroReprobados.put(curso.getCodigo(), curso.getNumero());
        }

        //Agregamos el revisar duplicados para matricular
        HashSet<Integer> candidatosDuplicados = new HashSet<>();
        for (Integer codigoCursoCantidato : codigosCursosCandidatos) {
            if (!candidatosDuplicados.add(codigoCursoCantidato) ||
                    !codigoNumeroMatriculables.containsKey(codigoCursoCantidato)) {
                System.out.println("Lista de cursos a matricular invalida");
                return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
            }
            //Vamos sumando creditos para ver s i se exceden
            creditos += codigoNumeroMatriculables.get(codigoCursoCantidato);
            if (creditos > maxCreditos) {
                System.out.println("Exceso de creditos a matricular");
                return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
            }
        }

        if (creditos < minCreditos) {
            System.out.println("No se cumple el minimo de creditos a matricular");
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }

        //Matriculamos al alumno en los cursos solicitados, consideramos sus matriculas anteriores
        for (Integer codigoCurso : codigosCursosCandidatos) {
            if (!codigoNumeroReprobados.containsKey(codigoCurso))
                alumnoRepository.matricularNuevo(cui, codigoCurso);
            else
                alumnoRepository.matricularJalado(cui, codigoCurso);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
