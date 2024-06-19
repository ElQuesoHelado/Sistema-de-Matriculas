package com.ti.matriculas.controllers;

import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class HistorialController {
    @Autowired
    private AlumnoRepository repository;

    @GetMapping("/historial")
    public String historial(@RequestParam(name = "cui") int cui, Model model){
        List<AlumnoRepository.Curso> historial = repository.get_historial(cui);
        model.addAttribute("historial", historial);
        return "historial";
    }
}
