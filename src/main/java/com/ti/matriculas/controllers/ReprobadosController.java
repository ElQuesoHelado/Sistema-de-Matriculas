package com.ti.matriculas.controllers;

import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ReprobadosController {
    private final AlumnoRepository repository;

    @Autowired
    public ReprobadosController(AlumnoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/reprobados")
    public List<AlumnoRepository.Curso> reprobados(@RequestParam(name = "cui") int cui, Model model) {
        return repository.get_cursos_reprobados(cui);
    }
}
