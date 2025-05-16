package com.modulodocente.backend.controller;

import com.modulodocente.backend.dto.DocenteRequestDTO;
import com.modulodocente.backend.entity.Docente;
import com.modulodocente.backend.entity.Usuario;
import com.modulodocente.backend.repository.DocenteRepository;
import com.modulodocente.backend.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/docentes")
@CrossOrigin(origins = "http://localhost:5173")
public class DocenteController {

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/registrar")
        public ResponseEntity<?> registrarDocente(@RequestBody DocenteRequestDTO request) {
        List<String> errores = new ArrayList<>();

        if (!request.password.equals(request.confirmPassword)) {
            errores.add("Las contraseñas no coinciden.");
        }

        if (!request.email.endsWith("@unmsm.edu.pe")) {
            errores.add("El correo debe terminar en @unmsm.edu.pe.");
        }

        if (usuarioRepository.existsByUsername(request.email)) {
            errores.add("Ya existe un usuario con ese correo.");
        }

        if (docenteRepository.existsByCodigo(request.codigo)) {
            errores.add("Ya existe un docente con ese código.");
        }

        if (!errores.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(request.email);
        usuario.setPassword(request.password);
        usuario.setNombrevisualizar(request.nombres + " " + request.apellidos);
        usuario.setEstado("1");
        usuario.setFechacreacion(LocalDateTime.now().toString());

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        Docente docente = new Docente();
        docente.setCodigo(request.codigo);
        docente.setNombres(request.nombres);
        docente.setApellidos(request.apellidos);
        docente.setEmail(request.email);
        docente.setEstado("1");
        docente.setClaseid(request.claseId);
        docente.setCategoriaid(request.categoriaId);
        docente.setUsuarioid(usuarioGuardado.getId());
        docente.setInstitucionid(request.institucionId);
        docente.setDepartamentoid(request.departamentoId);

        docenteRepository.save(docente);

        return ResponseEntity.ok("Registro exitoso");
    }
}

