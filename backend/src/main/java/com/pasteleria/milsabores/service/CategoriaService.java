package com.pasteleria.milsabores.service;

import com.pasteleria.milsabores.dto.CategoriaDTO;
import com.pasteleria.milsabores.entity.Categoria;
import com.pasteleria.milsabores.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CategoriaDTO> listarTodas() {
        return categoriaRepository.findAll().stream()
                .map(CategoriaDTO::new)
                .collect(Collectors.toList());
    }

    public CategoriaDTO obtenerPorId(Long id) {
        Categoria c = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
        return new CategoriaDTO(c);
    }

    @Transactional
    public CategoriaDTO crear(CategoriaDTO dto) {
        Categoria c = new Categoria();
        c.setCodigo(dto.getCodigo() != null ? dto.getCodigo() : "CAT-" + System.currentTimeMillis() % 1000);
        c.setNombre(dto.getNombre());
        c.setDescripcion(dto.getDescripcion());
        c.setImagen(dto.getImagen());
        return new CategoriaDTO(categoriaRepository.save(c));
    }

    @Transactional
    public CategoriaDTO actualizar(Long id, CategoriaDTO dto) {
        Categoria c = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
        if (dto.getNombre() != null) c.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) c.setDescripcion(dto.getDescripcion());
        if (dto.getImagen() != null) c.setImagen(dto.getImagen());
        return new CategoriaDTO(categoriaRepository.save(c));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada con ID: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}
