package com.pasteleria.milsabores.dto;

public class AuthResponse {

    private String token;
    private String tipo = "Bearer";
    private UsuarioResponse usuario;

    public AuthResponse() {}

    public AuthResponse(String token, UsuarioResponse usuario) {
        this.token = token;
        this.usuario = usuario;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public UsuarioResponse getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioResponse usuario) {
        this.usuario = usuario;
    }
}
