package com.pasteleria.milsabores.repository;

import com.pasteleria.milsabores.entity.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    Optional<Orden> findByNumeroOrden(String numeroOrden);
    List<Orden> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
    List<Orden> findAllByOrderByFechaDesc();
}
