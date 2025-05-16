package com.modulodocente.backend.repository;

import com.modulodocente.backend.entity.Clase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaseRepository extends JpaRepository<Clase, String> {
}

