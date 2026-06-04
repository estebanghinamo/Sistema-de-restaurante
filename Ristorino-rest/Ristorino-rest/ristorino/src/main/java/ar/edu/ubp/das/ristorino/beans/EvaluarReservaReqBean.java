package ar.edu.ubp.das.ristorino.beans;

import lombok.Data;

@Data
public class EvaluarReservaReqBean {
    private String codReservaSucursal;
    private Integer nroRestaurante;
    private String feedback;
    private Integer puntuacion;
}
