package com.pasteleria.milsabores.controller;

import com.pasteleria.milsabores.dto.AuthResponse;
import com.pasteleria.milsabores.dto.LoginRequest;
import com.pasteleria.milsabores.dto.RegistroRequest;
import com.pasteleria.milsabores.dto.UsuarioResponse;
import com.pasteleria.milsabores.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Endpoints para inicio de sesión, registro y perfil con tokens JWT")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión y obtener token JWT", description = "Valida las credenciales contra la BD y retorna un token JWT válido por 24 horas junto al rol del usuario.")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    @Operation(summary = "Registrar nuevo usuario cliente", description = "Crea un nuevo usuario con rol CLIENTE, encripta su contraseña con BCrypt y retorna su sesión JWT inicial.")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest request) {
        AuthResponse response = authService.registrar(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Obtener perfil del usuario autenticado", description = "Retorna la información del usuario autenticado a partir del token JWT enviado en la cabecera.")
    public ResponseEntity<UsuarioResponse> obtenerPerfil(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        UsuarioResponse perfil = authService.obtenerPerfil(authentication.getName());
        return ResponseEntity.ok(perfil);
    }
}
