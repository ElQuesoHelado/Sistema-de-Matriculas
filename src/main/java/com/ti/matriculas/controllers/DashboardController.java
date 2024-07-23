package com.ti.matriculas.controllers;

import com.ti.matriculas.entity.Alumno;
import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
public class DashboardController {
    private final AlumnoRepository repository;

    @Autowired
    public DashboardController(AlumnoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/dashboard")
//    public String dashboard(@RequestParam(name = "cui") int cui, Model model) {
//    public String dashboard(@RequestBody AlumnoDet alumnoDet, Model model) {
    public String dashboard(Model model) {
        //Se obtienen datos del usuario autenticado
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        String username = authentication.getName();
//        Object principal = authentication.getPrincipal();

//        System.out.println(username);
//        System.out.println(principal);

        //Excepciones?
        int cui = Integer.parseInt(username);

        Alumno alumno = repository.findByCui(cui);
        if (alumno == null)
            return String.format("redirect:/?error=No se encontro el CUI %d", cui);
        Float promedio = repository.get_promedio_general(cui);
        Integer semestre = repository.get_semestre(cui);
        Integer creditos_aprobados = repository.get_creditos_aprobados(cui);
        Integer creditos_reprobados = repository.get_creditos_reprobados(cui);
        Integer creditos_matriculados = repository.get_creditos_matriculados(cui);

        model.addAttribute("cui", alumno.getCui());
        model.addAttribute("pnombre", alumno.getPnombre());
        model.addAttribute("papellido", alumno.getPapellido());
        model.addAttribute("semestre", semestre);
        model.addAttribute("promedio", Math.round(promedio));
        model.addAttribute("creditos_aprobados", creditos_aprobados);
        model.addAttribute("creditos_reprobados", creditos_reprobados);
        model.addAttribute("creditos_matriculados", creditos_matriculados);

        return "dashboard";
    }
}
