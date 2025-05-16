package com.modulodocente.backend.repository;

import com.modulodocente.backend.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, String> {
}
