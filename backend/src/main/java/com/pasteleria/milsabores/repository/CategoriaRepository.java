package com.pasteleria.milsabores.repository;

import com.pasteleria.milsabores.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findByNombre(String nombre);
    Optional<Categoria> findByCodigo(String codigo);
}
