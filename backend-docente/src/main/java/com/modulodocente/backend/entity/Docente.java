package com.modulodocente.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "docente")
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String codigo;
    private String nombres;
    private String apellidos;
    private String email;
    private String estado;

    private String claseid;
    private String categoriaid;
    private Integer usuarioid;
    private Integer institucionid;
    private Long departamentoid;

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

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getClaseid() {
        return claseid;
    }

    public void setClaseid(String claseid) {
        this.claseid = claseid;
    }

    public String getCategoriaid() {
        return categoriaid;
    }

    public void setCategoriaid(String categoriaid) {
        this.categoriaid = categoriaid;
    }

    public Integer getUsuarioid() {
        return usuarioid;
    }

    public void setUsuarioid(Integer usuarioid) {
        this.usuarioid = usuarioid;
    }

    public Integer getInstitucionid() {
        return institucionid;
    }

    public void setInstitucionid(Integer institucionid) {
        this.institucionid = institucionid;
    }

    public Long getDepartamentoid() {
        return departamentoid;
    }

    public void setDepartamentoid(Long departamentoid) {
        this.departamentoid = departamentoid;
    }
}

