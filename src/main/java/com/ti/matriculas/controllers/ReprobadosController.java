package com.ti.matriculas.controllers;

import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class ReprobadosController {
    @Autowired
    private AlumnoRepository repository;

    @GetMapping("/reprobados")
    public String reprobados(@RequestParam(name = "cui") int cui, Model model){
        List<AlumnoRepository.Curso> reprobados = repository.get_cursos_reprobados(cui);
        model.addAttribute("reprobados", reprobados);
        return "reprobados";
    }
}
