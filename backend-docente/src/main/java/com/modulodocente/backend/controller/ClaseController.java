package com.modulodocente.backend.controller;

import com.modulodocente.backend.entity.Clase;
import com.modulodocente.backend.repository.ClaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clases")
@CrossOrigin(origins = "http://localhost:5173") // Asegura conexión con el front
public class ClaseController {

    @Autowired
    private ClaseRepository claseRepository;

    @GetMapping
    public List<Clase> getAllClases() {
        return claseRepository.findAll();
    }
}
