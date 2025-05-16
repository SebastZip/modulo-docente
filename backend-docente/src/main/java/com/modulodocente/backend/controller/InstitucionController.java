package com.modulodocente.backend.controller;

import com.modulodocente.backend.entity.Institucion;
import com.modulodocente.backend.repository.InstitucionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 💡 Esto le dice a Spring que esta clase es un controlador
@RequestMapping("/api/instituciones") // 💡 Esta es la ruta base que usará el frontend
@CrossOrigin(origins = "http://localhost:5173") // 💡 Permite peticiones desde React
public class InstitucionController {

    @Autowired
    private InstitucionRepository institucionRepository;

    @GetMapping
    public List<Institucion> listarInstituciones() {
        return institucionRepository.findAll();
    }
}
