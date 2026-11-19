package com.pasteleria.milsabores.repository;

import com.pasteleria.milsabores.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Optional<Producto> findByCodigo(String codigo);
    List<Producto> findByCategoriaId(Long categoriaId);
    List<Producto> findByCategoriaNombreIgnoreCase(String categoriaNombre);
    List<Producto> findByDestacadoTrue();
    List<Producto> findByEnOfertaTrue();
    List<Producto> findByNombreContainingIgnoreCase(String texto);
}
