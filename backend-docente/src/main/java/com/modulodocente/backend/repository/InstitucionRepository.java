package com.modulodocente.backend.repository;

import com.modulodocente.backend.entity.Institucion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstitucionRepository extends JpaRepository<Institucion, Integer> {
}
