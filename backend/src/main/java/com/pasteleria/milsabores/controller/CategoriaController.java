package com.pasteleria.milsabores.controller;

import com.pasteleria.milsabores.dto.CategoriaDTO;
import com.pasteleria.milsabores.dto.MensajeResponse;
import com.pasteleria.milsabores.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorías", description = "Operaciones CRUD para las categorías de la pastelería")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    @Operation(summary = "Listar todas las categorías", description = "Retorna la lista de categorías disponibles en la tienda de forma pública.")
    public ResponseEntity<List<CategoriaDTO>> listarTodas() {
        return ResponseEntity.ok(categoriaService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoría por ID", description = "Retorna la información de una categoría específica.")
    public ResponseEntity<CategoriaDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Crear nueva categoría (Exclusivo Administrador)", description = "Agrega una nueva categoría al sistema.")
    public ResponseEntity<CategoriaDTO> crear(@RequestBody CategoriaDTO dto) {
        CategoriaDTO nueva = categoriaService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Actualizar categoría (Exclusivo Administrador)", description = "Actualiza los datos de una categoría existente.")
    public ResponseEntity<CategoriaDTO> actualizar(@PathVariable Long id, @RequestBody CategoriaDTO dto) {
        CategoriaDTO actualizada = categoriaService.actualizar(id, dto);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Eliminar categoría (Exclusivo Administrador)", description = "Elimina una categoría del sistema.")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.ok(new MensajeResponse(true, "Categoría eliminada con éxito con ID: " + id));
    }
}
