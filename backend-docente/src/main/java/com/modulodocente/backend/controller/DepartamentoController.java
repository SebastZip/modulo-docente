package com.modulodocente.backend.controller;

import com.modulodocente.backend.entity.Departamento;
import com.modulodocente.backend.repository.DepartamentoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departamentos")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartamentoController {

    @Autowired
    private DepartamentoRepository departamentoRepository;

    @GetMapping
    public List<Departamento> listarDepartamentos() {
        return departamentoRepository.findAll();
    }
}

