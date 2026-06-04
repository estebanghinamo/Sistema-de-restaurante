package ar.edu.ubp.das.ristorino.beans;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class RestauranteHomeBean {

    private String nroRestaurante;
    private String razonSocial;
    //private  String destacado;
    private Map<String, List<String>> categorias = new LinkedHashMap<>();
    private List<SucursalesHomeBean> sucursales = new ArrayList<>();
    private Double promedioValoracion;
    private Integer cantidadReservas;
    private Integer rankingReservas;
    private Boolean esFavorito;

    public Boolean getEsFavorito() {
        return esFavorito;
    }

    public void setEsFavorito(Boolean esFavorito) {
        this.esFavorito = esFavorito;
    }
    /*public String getDestacado() {
        return destacado;
    }

    public void setDestacado(String destacado) {
        this.destacado = destacado;
    }*/

    public Double getPromedioValoracion() {
        return promedioValoracion;
    }

    public void setPromedioValoracion(Double promedioValoracion) {
        this.promedioValoracion = promedioValoracion;
    }
    public String getNroRestaurante() {
        return nroRestaurante;
    }

    public void setNroRestaurante(String nroRestaurante) {
        this.nroRestaurante = nroRestaurante;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public Map<String, List<String>> getCategorias() {
        return categorias;
    }

    public void setCategorias(Map<String, List<String>> categorias) {
        this.categorias = categorias;
    }

    public List<SucursalesHomeBean> getSucursales() {
        return sucursales;
    }

    public void setSucursales(List<SucursalesHomeBean> sucursales) {
        this.sucursales = sucursales;
    }
    public Integer getCantidadReservas() {
        return cantidadReservas;
    }

    public void setCantidadReservas(Integer cantidadReservas) {
        this.cantidadReservas = cantidadReservas;
    }

    public Integer getRankingReservas() {
        return rankingReservas;
    }

    public void setRankingReservas(Integer rankingReservas) {
        this.rankingReservas = rankingReservas;
    }
}
