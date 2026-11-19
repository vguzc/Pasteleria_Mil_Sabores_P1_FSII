package com.pasteleria.milsabores.controller;

import com.pasteleria.milsabores.dto.MensajeResponse;
import com.pasteleria.milsabores.dto.UsuarioResponse;
import com.pasteleria.milsabores.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('ADMINISTRADOR')")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Usuarios (Admin)", description = "Administración de usuarios y roles del sistema. Acceso exclusivo para administradores.")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar todos los usuarios", description = "Retorna el listado de todos los usuarios registrados con sus roles asociados.")
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Retorna el perfil completo de un usuario por su ID.")
    public ResponseEntity<UsuarioResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Modifica los datos o rol de un usuario existente.")
    public ResponseEntity<UsuarioResponse> actualizar(@PathVariable Long id, @RequestBody UsuarioResponse dto) {
        return ResponseEntity.ok(usuarioService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema.")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.ok(new MensajeResponse(true, "Usuario eliminado correctamente"));
    }
}
