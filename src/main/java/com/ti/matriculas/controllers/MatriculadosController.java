package com.ti.matriculas.controllers;


import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MatriculadosController {
    private final AlumnoRepository repository;

    @Autowired
    public MatriculadosController(AlumnoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/matriculados")
    public List<AlumnoRepository.CursoDocente> matriculados(Model model) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return repository.get_cursos_matriculados(Integer.parseInt(username));
    }
}
