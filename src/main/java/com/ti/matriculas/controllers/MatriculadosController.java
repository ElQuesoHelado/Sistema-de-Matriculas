package com.ti.matriculas.controllers;


import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class MatriculadosController {
    @Autowired
    private AlumnoRepository repository;

    @GetMapping("/matriculados")
    public String matriculados(@RequestParam(name = "cui") int cui, Model model){
        List<AlumnoRepository.Curso> matriculados = repository.get_cursos_matriculados(cui);
        model.addAttribute("matriculados", matriculados);
        return "matriculados";
    }
}
