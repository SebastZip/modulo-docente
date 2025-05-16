package com.modulodocente.backend.repository;

import com.modulodocente.backend.entity.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
}

