package com.modulodocente.backend.repository;

import com.modulodocente.backend.entity.Docente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocenteRepository extends JpaRepository<Docente, Integer> {
    boolean existsByCodigo(String codigo);
}

