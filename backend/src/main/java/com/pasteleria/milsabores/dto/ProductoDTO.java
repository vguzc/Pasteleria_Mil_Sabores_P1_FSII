package com.pasteleria.milsabores.dto;

import com.pasteleria.milsabores.entity.Producto;

public class ProductoDTO {

    private Long id;
    private String codigo;
    private String nombre;
    private String descripcion;
    private Integer precio;
    private Integer precioAnterior;
    private Integer stock;
    private Long categoriaId;
    private String categoria;
    private String imagen;
    private Boolean destacado;
    private Boolean enOferta;

    public ProductoDTO() {}

    public ProductoDTO(Producto p) {
        this.id = p.getId();
        this.codigo = p.getCodigo();
        this.nombre = p.getNombre();
        this.descripcion = p.getDescripcion();
        this.precio = p.getPrecio();
        this.precioAnterior = p.getPrecioAnterior();
        this.stock = p.getStock();
        if (p.getCategoria() != null) {
            this.categoriaId = p.getCategoria().getId();
            this.categoria = p.getCategoria().getNombre();
        }
        this.imagen = p.getImagen();
        this.destacado = p.getDestacado();
        this.enOferta = p.getEnOferta();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getPrecio() {
        return precio;
    }

    public void setPrecio(Integer precio) {
        this.precio = precio;
    }

    public Integer getPrecioAnterior() {
        return precioAnterior;
    }

    public void setPrecioAnterior(Integer precioAnterior) {
        this.precioAnterior = precioAnterior;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Boolean getDestacado() {
        return destacado;
    }

    public void setDestacado(Boolean destacado) {
        this.destacado = destacado;
    }

    public Boolean getEnOferta() {
        return enOferta;
    }

    public void setEnOferta(Boolean enOferta) {
        this.enOferta = enOferta;
    }
}
