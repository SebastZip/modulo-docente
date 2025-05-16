package com.modulodocente.backend.repository;

import com.modulodocente.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Este es el método que necesitas para verificar si ya existe un usuario con ese username
    Optional<Usuario> findByUsername(String username);
    boolean existsByUsername(String username);

}
