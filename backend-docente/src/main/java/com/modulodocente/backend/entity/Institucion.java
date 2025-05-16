package com.modulodocente.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "institucion")
public class Institucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String codigo;

    @Column(name = "nombreCorto")
    private String nombreCorto;

    @Column(name = "nombreLargo")
    private String nombreLargo;

    @Column(name = "nombreComercial")
    private String nombreComercial;

    @Column(name = "estado")
    private String estado;

    // Getters y setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombreCorto() {
        return nombreCorto;
    }

    public void setNombreCorto(String nombreCorto) {
        this.nombreCorto = nombreCorto;
    }

    public String getNombreLargo() {
        return nombreLargo;
    }

    public void setNombreLargo(String nombreLargo) {
        this.nombreLargo = nombreLargo;
    }

    public String getNombreComercial() {
        return nombreComercial;
    }

    public void setNombreComercial(String nombreComercial) {
        this.nombreComercial = nombreComercial;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
