package com.ti.matriculas.controllers;

import com.ti.matriculas.entity.Alumno;
import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {
    private final AlumnoRepository repository;

    @Autowired
    public LoginController(AlumnoRepository repository) {
        this.repository = repository;
    }

    //TODO: Cambio a post??
    @GetMapping("/login")
    public String login(@RequestParam(name = "cui") int cui, Model model){
        Alumno alumno = repository.findById(cui);
        Double promedio = repository.get_promedio_general(cui);
        model.addAttribute("cui",alumno.getCui());
        model.addAttribute("pnombre",alumno.getPnombre());
        model.addAttribute("snombre",alumno.getSnombre());
        model.addAttribute("papellido",alumno.getPapellido());
        model.addAttribute("sapellido",alumno.getSapellido());
        model.addAttribute("semestre",repository.get_semestre(cui));
        model.addAttribute("promedio",promedio);
        return "login";
    }
}
