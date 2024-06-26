package com.ti.matriculas.controllers;

import com.ti.matriculas.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PromediosController {
    private final AlumnoRepository repository;

    @Autowired
    public PromediosController(AlumnoRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/promedios")
    public List<AlumnoRepository.CursoPromedio> promedios(@RequestParam(name = "cui") int cui, Model model) {
        return repository.get_promedios(cui);
    }
}
