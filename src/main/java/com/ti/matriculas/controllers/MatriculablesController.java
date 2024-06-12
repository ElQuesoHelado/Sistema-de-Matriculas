package com.ti.matriculas.controllers;


import com.ti.matriculas.entity.Alumno;
import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class MatriculablesController {
    @Autowired
    private AlumnoRepository repository;

    @GetMapping("/matriculables")
    public String matriculables(@RequestParam(name = "cui") int cui, Model model){
        List<AlumnoRepository.CursoMatriculable> matriculables = repository.get_cursos_matriculables(cui);
        model.addAttribute("matriculables", matriculables);
        return "matriculables";
    }
}
