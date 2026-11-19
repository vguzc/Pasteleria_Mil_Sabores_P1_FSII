package com.pasteleria.milsabores.controller;

import com.pasteleria.milsabores.dto.MensajeResponse;
import com.pasteleria.milsabores.dto.ProductoDTO;
import com.pasteleria.milsabores.service.ProductoService;
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
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Operaciones CRUD para el catálogo de productos de la pastelería")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    @Operation(summary = "Listar productos con filtros opcionales", description = "Obtiene todos los productos. Permite filtrar por categoría, si es destacado o si está en oferta.")
    public ResponseEntity<List<ProductoDTO>> listar(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) Boolean destacados,
            @RequestParam(required = false) Boolean ofertas,
            @RequestParam(required = false) String q
    ) {
        if (q != null && !q.trim().isEmpty()) {
            return ResponseEntity.ok(productoService.buscarPorNombre(q.trim()));
        }
        if (Boolean.TRUE.equals(destacados)) {
            return ResponseEntity.ok(productoService.listarDestacados());
        }
        if (Boolean.TRUE.equals(ofertas)) {
            return ResponseEntity.ok(productoService.listarOfertas());
        }
        if (categoria != null && !categoria.trim().isEmpty()) {
            return ResponseEntity.ok(productoService.listarPorCategoria(categoria.trim()));
        }
        return ResponseEntity.ok(productoService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID", description = "Retorna el detalle completo de un producto por su clave primaria o por su código alfanumérico.")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable String id) {
        try {
            Long numId = Long.parseLong(id);
            return ResponseEntity.ok(productoService.obtenerPorId(numId));
        } catch (NumberFormatException e) {
            return ResponseEntity.ok(productoService.obtenerPorCodigo(id));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Crear nuevo producto (Admin)", description = "Agrega un nuevo producto al catálogo. Requiere token JWT con rol Administrador.")
    public ResponseEntity<ProductoDTO> crear(@RequestBody ProductoDTO dto) {
        ProductoDTO nuevo = productoService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Actualizar producto existente (Admin)", description = "Modifica los atributos de un producto existente. Requiere token JWT con rol Administrador.")
    public ResponseEntity<ProductoDTO> actualizar(@PathVariable Long id, @RequestBody ProductoDTO dto) {
        ProductoDTO actualizado = productoService.actualizar(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Eliminar producto del catálogo (Exclusivo Administrador)", description = "Elimina físicamente un producto. Requiere token JWT con rol Administrador.")
    public ResponseEntity<MensajeResponse> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.ok(new MensajeResponse(true, "Producto eliminado correctamente con ID: " + id));
    }
}
