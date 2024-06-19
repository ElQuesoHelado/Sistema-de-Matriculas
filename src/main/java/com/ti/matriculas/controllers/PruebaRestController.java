package com.ti.matriculas.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class PruebaRestController {
    @GetMapping("/prueba")
    public List<Integer> findAllEmployees() {
        List<Integer> res= Arrays.asList(1, 2, 3, 4, 45);
        return res;
    }
}
