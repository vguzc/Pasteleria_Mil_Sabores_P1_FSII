package com.pasteleria.milsabores.dto;

import com.pasteleria.milsabores.entity.Usuario;

public class UsuarioResponse {

    private Long id;
    private String codigo;
    private String nombre;
    private String apellidos;
    private String correo;
    private String rol;
    private String rut;
    private String fechaNacimiento;
    private String telefono;
    private String direccion;
    private String departamento;
    private String region;
    private String comuna;
    private String indicaciones;

    public UsuarioResponse() {}

    public UsuarioResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.codigo = usuario.getCodigo();
        this.nombre = usuario.getNombre();
        this.apellidos = usuario.getApellidos();
        this.correo = usuario.getCorreo();
        this.rol = usuario.getRol() != null ? usuario.getRol().getNombre().replace("ROLE_", "").toLowerCase() : "cliente";
        this.rut = usuario.getRut();
        this.fechaNacimiento = usuario.getFechaNacimiento();
        this.telefono = usuario.getTelefono();
        this.direccion = usuario.getDireccion();
        this.departamento = usuario.getDepartamento();
        this.region = usuario.getRegion();
        this.comuna = usuario.getComuna();
        this.indicaciones = usuario.getIndicaciones();
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

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getRut() {
        return rut;
    }

    public void setRut(String rut) {
        this.rut = rut;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getComuna() {
        return comuna;
    }

    public void setComuna(String comuna) {
        this.comuna = comuna;
    }

    public String getIndicaciones() {
        return indicaciones;
    }

    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }
}
