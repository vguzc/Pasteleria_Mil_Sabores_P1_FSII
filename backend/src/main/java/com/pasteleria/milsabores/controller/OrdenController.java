package com.pasteleria.milsabores.controller;

import com.pasteleria.milsabores.dto.OrdenRequest;
import com.pasteleria.milsabores.entity.Orden;
import com.pasteleria.milsabores.service.OrdenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Órdenes de Compra", description = "Endpoints para registro de compras, carrito y consulta de órdenes")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @PostMapping
    @Operation(summary = "Crear nueva orden de compra", description = "Registra una orden de compra generada desde el checkout del frontend, descuenta el stock de los productos y la asocia al usuario autenticado.")
    public ResponseEntity<Orden> crearOrden(@RequestBody OrdenRequest request, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Orden orden = ordenService.crearOrden(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(orden);
    }

    @GetMapping
    @Operation(summary = "Listar órdenes según permisos", description = "Si el usuario es Administrador o Vendedor ve todas las órdenes; si es cliente ve únicamente sus compras.")
    public ResponseEntity<List<Orden>> listar(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean esStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR") || a.getAuthority().equals("ROLE_VENDEDOR"));

        if (esStaff) {
            return ResponseEntity.ok(ordenService.listarTodas());
        } else {
            return ResponseEntity.ok(ordenService.listarPorUsuario(authentication.getName()));
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener orden por ID", description = "Consulta el detalle y los productos asociados a una orden.")
    public ResponseEntity<Orden> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ordenService.obtenerPorId(id));
    }
}
