package com.ti.matriculas.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "alumno")
public class Alumno {
    @Id
    private int cui;
    private String pnombre;
    private String snombre;
    private String papellido;
    private String sapellido;
    private String email1;
    private String email2;

    protected Alumno(){}

    public Alumno(int cui, String pnombre, String snombre, String papellido, String sapellido, String email1, String email2) {
        this.cui = cui;
        this.pnombre = pnombre;
        this.snombre = snombre;
        this.papellido = papellido;
        this.sapellido = sapellido;
        this.email1 = email1;
        this.email2 = email2;
    }

    @Override
    public String toString() {
        return "Alumno{" +
                "cui=" + cui +
                ", pnombre='" + pnombre + '\'' +
                ", snombre='" + snombre + '\'' +
                ", papellido='" + papellido + '\'' +
                ", sapellido='" + sapellido + '\'' +
                ", email1='" + email1 + '\'' +
                ", email2='" + email2 + '\'' +
                '}';
    }

    public int getCui() {
        return cui;
    }

    public String getPnombre() {
        return pnombre;
    }

    public String getSnombre() {
        return snombre;
    }

    public String getPapellido() {
        return papellido;
    }

    public String getSapellido() {
        return sapellido;
    }

    public String getEmail1() {
        return email1;
    }

    public String getEmail2() {
        return email2;
    }
}
