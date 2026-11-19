package com.pasteleria.milsabores.service;

import com.pasteleria.milsabores.dto.DetalleOrdenRequest;
import com.pasteleria.milsabores.dto.OrdenRequest;
import com.pasteleria.milsabores.entity.DetalleOrden;
import com.pasteleria.milsabores.entity.Orden;
import com.pasteleria.milsabores.entity.Producto;
import com.pasteleria.milsabores.entity.Usuario;
import com.pasteleria.milsabores.repository.OrdenRepository;
import com.pasteleria.milsabores.repository.ProductoRepository;
import com.pasteleria.milsabores.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Orden> listarTodas() {
        return ordenRepository.findAllByOrderByFechaDesc();
    }

    public Orden obtenerPorId(Long id) {
        return ordenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + id));
    }

    public List<Orden> listarPorUsuario(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con correo: " + correo));
        return ordenRepository.findByUsuarioIdOrderByFechaDesc(usuario.getId());
    }

    @Transactional
    public Orden crearOrden(String correoUsuario, OrdenRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con correo: " + correoUsuario));

        Orden orden = new Orden();
        orden.setNumeroOrden(request.getNumeroOrden() != null ? request.getNumeroOrden() : String.valueOf(System.currentTimeMillis()));
        orden.setUsuario(usuario);
        orden.setFecha(LocalDateTime.now());
        orden.setSubtotal(request.getSubtotal() != null ? request.getSubtotal() : 0);
        orden.setDescuento(request.getDescuento() != null ? request.getDescuento() : 0);
        orden.setIva(request.getIva() != null ? request.getIva() : 0);
        orden.setEnvio(request.getEnvio() != null ? request.getEnvio() : 0);
        orden.setTotal(request.getTotal() != null ? request.getTotal() : 0);
        orden.setEstado("Pagada");
        orden.setMetodoPago(request.getMetodoPago() != null ? request.getMetodoPago() : "Webpay Plus");
        orden.setMetodoEntrega(request.getMetodoEntrega() != null ? request.getMetodoEntrega() : "despacho");
        orden.setDireccionDespacho(request.getDireccionDespacho());
        orden.setComunaDespacho(request.getComunaDespacho());
        orden.setSucursalRetiro(request.getSucursalRetiro());

        if (request.getItems() != null) {
            for (DetalleOrdenRequest itemDto : request.getItems()) {
                DetalleOrden det = new DetalleOrden();
                det.setOrden(orden);

                Producto p = null;
                if (itemDto.getProductoId() != null) {
                    p = productoRepository.findById(itemDto.getProductoId()).orElse(null);
                } else if (itemDto.getCodigo() != null) {
                    p = productoRepository.findByCodigo(itemDto.getCodigo()).orElse(null);
                }

                if (p != null) {
                    det.setProducto(p);
                    det.setNombreProducto(p.getNombre());
                    // Descontar stock
                    if (p.getStock() >= itemDto.getCantidad()) {
                        p.setStock(p.getStock() - itemDto.getCantidad());
                        productoRepository.save(p);
                    }
                } else {
                    det.setNombreProducto(itemDto.getNombre() != null ? itemDto.getNombre() : "Producto");
                }

                det.setPrecioUnitario(itemDto.getPrecio() != null ? itemDto.getPrecio() : 0);
                det.setCantidad(itemDto.getCantidad() != null ? itemDto.getCantidad() : 1);
                det.setSubtotal(itemDto.getSubtotal() != null ? itemDto.getSubtotal() : (det.getPrecioUnitario() * det.getCantidad()));

                orden.getDetalles().add(det);
            }
        }

        return ordenRepository.save(orden);
    }
}
