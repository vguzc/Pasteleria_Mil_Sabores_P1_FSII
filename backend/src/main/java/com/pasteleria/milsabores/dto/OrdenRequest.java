package com.pasteleria.milsabores.dto;

import java.util.List;

public class OrdenRequest {

    private String numeroOrden;
    private Integer subtotal;
    private Integer descuento;
    private Integer iva;
    private Integer envio;
    private Integer total;
    private String metodoPago;
    private String metodoEntrega;
    private String direccionDespacho;
    private String comunaDespacho;
    private String sucursalRetiro;
    private List<DetalleOrdenRequest> items;

    public OrdenRequest() {}

    public String getNumeroOrden() {
        return numeroOrden;
    }

    public void setNumeroOrden(String numeroOrden) {
        this.numeroOrden = numeroOrden;
    }

    public Integer getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Integer subtotal) {
        this.subtotal = subtotal;
    }

    public Integer getDescuento() {
        return descuento;
    }

    public void setDescuento(Integer descuento) {
        this.descuento = descuento;
    }

    public Integer getIva() {
        return iva;
    }

    public void setIva(Integer iva) {
        this.iva = iva;
    }

    public Integer getEnvio() {
        return envio;
    }

    public void setEnvio(Integer envio) {
        this.envio = envio;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getMetodoEntrega() {
        return metodoEntrega;
    }

    public void setMetodoEntrega(String metodoEntrega) {
        this.metodoEntrega = metodoEntrega;
    }

    public String getDireccionDespacho() {
        return direccionDespacho;
    }

    public void setDireccionDespacho(String direccionDespacho) {
        this.direccionDespacho = direccionDespacho;
    }

    public String getComunaDespacho() {
        return comunaDespacho;
    }

    public void setComunaDespacho(String comunaDespacho) {
        this.comunaDespacho = comunaDespacho;
    }

    public String getSucursalRetiro() {
        return sucursalRetiro;
    }

    public void setSucursalRetiro(String sucursalRetiro) {
        this.sucursalRetiro = sucursalRetiro;
    }

    public List<DetalleOrdenRequest> getItems() {
        return items;
    }

    public void setItems(List<DetalleOrdenRequest> items) {
        this.items = items;
    }
}
