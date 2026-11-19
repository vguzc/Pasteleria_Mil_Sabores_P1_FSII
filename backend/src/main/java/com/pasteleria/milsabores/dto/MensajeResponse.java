package com.pasteleria.milsabores.dto;

public class MensajeResponse {

    private boolean exito;
    private String mensaje;

    public MensajeResponse() {}

    public MensajeResponse(boolean exito, String mensaje) {
        this.exito = exito;
        this.mensaje = mensaje;
    }

    public boolean isExito() {
        return exito;
    }

    public void setExito(boolean exito) {
        this.exito = exito;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
