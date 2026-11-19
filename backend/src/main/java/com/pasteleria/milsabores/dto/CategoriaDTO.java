package com.pasteleria.milsabores.dto;

import com.pasteleria.milsabores.entity.Categoria;

public class CategoriaDTO {

    private Long id;
    private String codigo;
    private String nombre;
    private String descripcion;
    private String imagen;

    public CategoriaDTO() {}

    public CategoriaDTO(Categoria c) {
        this.id = c.getId();
        this.codigo = c.getCodigo();
        this.nombre = c.getNombre();
        this.descripcion = c.getDescripcion();
        this.imagen = c.getImagen();
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

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
}
