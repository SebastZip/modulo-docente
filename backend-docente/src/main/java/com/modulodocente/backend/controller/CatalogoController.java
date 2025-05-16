package com.modulodocente.backend.controller;

import com.modulodocente.backend.entity.Categoria;
import com.modulodocente.backend.entity.Institucion;
import com.modulodocente.backend.entity.Departamento;
import com.modulodocente.backend.repository.CategoriaRepository;
import com.modulodocente.backend.repository.InstitucionRepository;
import com.modulodocente.backend.repository.DepartamentoRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogo")
@CrossOrigin(origins = "*") // para permitir que el frontend acceda
public class CatalogoController {

    private final CategoriaRepository categoriaRepo;
    private final InstitucionRepository institucionRepo;
    private final DepartamentoRepository departamentoRepo;

    public CatalogoController(CategoriaRepository categoriaRepo, InstitucionRepository institucionRepo, DepartamentoRepository departamentoRepo) {
        this.categoriaRepo = categoriaRepo;
        this.institucionRepo = institucionRepo;
        this.departamentoRepo = departamentoRepo;
    }

    @GetMapping("/categorias")
    public List<Categoria> listarCategorias() {
        return categoriaRepo.findAll();
    }

    @GetMapping("/instituciones")
    public List<Institucion> listarInstituciones() {
        return institucionRepo.findAll();
    }

    @GetMapping("/departamentos")
    public List<Departamento> listarDepartamentos() {
        return departamentoRepo.findAll();
    }
}

