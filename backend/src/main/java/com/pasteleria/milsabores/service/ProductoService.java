package com.pasteleria.milsabores.service;

import com.pasteleria.milsabores.dto.ProductoDTO;
import com.pasteleria.milsabores.entity.Categoria;
import com.pasteleria.milsabores.entity.Producto;
import com.pasteleria.milsabores.repository.CategoriaRepository;
import com.pasteleria.milsabores.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<ProductoDTO> listarTodos() {
        return productoRepository.findAll().stream()
                .map(ProductoDTO::new)
                .collect(Collectors.toList());
    }

    public ProductoDTO obtenerPorId(Long id) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return new ProductoDTO(p);
    }

    public ProductoDTO obtenerPorCodigo(String codigo) {
        Producto p = productoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con código: " + codigo));
        return new ProductoDTO(p);
    }

    public List<ProductoDTO> listarPorCategoria(String categoria) {
        return productoRepository.findByCategoriaNombreIgnoreCase(categoria).stream()
                .map(ProductoDTO::new)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> listarDestacados() {
        return productoRepository.findByDestacadoTrue().stream()
                .map(ProductoDTO::new)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> listarOfertas() {
        return productoRepository.findByEnOfertaTrue().stream()
                .map(ProductoDTO::new)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> buscarPorNombre(String texto) {
        return productoRepository.findByNombreContainingIgnoreCase(texto).stream()
                .map(ProductoDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductoDTO crear(ProductoDTO dto) {
        Producto p = new Producto();
        p.setCodigo(dto.getCodigo() != null ? dto.getCodigo() : "PRD-" + System.currentTimeMillis() % 10000);
        p.setNombre(dto.getNombre());
        p.setDescripcion(dto.getDescripcion());
        p.setPrecio(dto.getPrecio());
        p.setPrecioAnterior(dto.getPrecioAnterior());
        p.setStock(dto.getStock() != null ? dto.getStock() : 10);
        p.setImagen(dto.getImagen());
        p.setDestacado(dto.getDestacado() != null ? dto.getDestacado() : false);
        p.setEnOferta(dto.getEnOferta() != null ? dto.getEnOferta() : false);

        if (dto.getCategoriaId() != null) {
            Categoria c = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + dto.getCategoriaId()));
            p.setCategoria(c);
        } else if (dto.getCategoria() != null) {
            Categoria c = categoriaRepository.findByNombre(dto.getCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + dto.getCategoria()));
            p.setCategoria(c);
        } else {
            throw new RuntimeException("Debe especificar una categoría para el producto");
        }

        Producto guardado = productoRepository.save(p);
        return new ProductoDTO(guardado);
    }

    @Transactional
    public ProductoDTO actualizar(Long id, ProductoDTO dto) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        if (dto.getNombre() != null) p.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) p.setDescripcion(dto.getDescripcion());
        if (dto.getPrecio() != null) p.setPrecio(dto.getPrecio());
        if (dto.getPrecioAnterior() != null) p.setPrecioAnterior(dto.getPrecioAnterior());
        if (dto.getStock() != null) p.setStock(dto.getStock());
        if (dto.getImagen() != null) p.setImagen(dto.getImagen());
        if (dto.getDestacado() != null) p.setDestacado(dto.getDestacado());
        if (dto.getEnOferta() != null) p.setEnOferta(dto.getEnOferta());

        if (dto.getCategoriaId() != null) {
            Categoria c = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + dto.getCategoriaId()));
            p.setCategoria(c);
        } else if (dto.getCategoria() != null) {
            Categoria c = categoriaRepository.findByNombre(dto.getCategoria())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + dto.getCategoria()));
            p.setCategoria(c);
        }

        return new ProductoDTO(productoRepository.save(p));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }
}
