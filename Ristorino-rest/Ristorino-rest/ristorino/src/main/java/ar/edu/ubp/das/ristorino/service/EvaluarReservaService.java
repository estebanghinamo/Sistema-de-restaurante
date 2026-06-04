package ar.edu.ubp.das.ristorino.service;

import ar.edu.ubp.das.ristorino.beans.EvaluarReservaReqBean;
import ar.edu.ubp.das.ristorino.beans.ResponseBean;
import ar.edu.ubp.das.ristorino.clients.RestauranteClient;
import ar.edu.ubp.das.ristorino.clients.RestauranteClientFactory;
import ar.edu.ubp.das.ristorino.repositories.RistorinoRepository;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class EvaluarReservaService {

    private final RistorinoRepository ristorinoRepository;
    private final RestauranteClientFactory clientFactory;
    private final Gson gson;

    public EvaluarReservaService(RistorinoRepository ristorinoRepository,
                                 RestauranteClientFactory clientFactory,
                                 Gson gson) {
        this.ristorinoRepository = ristorinoRepository;
        this.clientFactory = clientFactory;
        this.gson = gson;
    }

    public ResponseBean evaluarReserva(EvaluarReservaReqBean req) {

        try {

            RestauranteClient client =
                    clientFactory.getClient(req.getNroRestaurante());

            String json = gson.toJson(req);

            // 1️⃣ Llamar restaurante
            ResponseBean rtaRest =
                    client.evaluarReserva(json);

            if (!rtaRest.isSuccess()) {
                return rtaRest;
            }

            // 2️⃣ Actualizar Ristorino
            ResponseBean rtaRis =
                    ristorinoRepository.evaluarReservaRistorino(json);

            return rtaRis;

        } catch (Exception e) {

            return new ResponseBean(
                    false,
                    "ERROR",
                    e.getMessage()
            );
        }
    }
}