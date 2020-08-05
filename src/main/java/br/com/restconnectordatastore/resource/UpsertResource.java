package br.com.restconnectordatastore.resource;

import br.com.restconnectordatastore.model.RequestUpsertDataDatastore;
import br.com.restconnectordatastore.model.ResponseUpsertDatastore;
import br.com.restconnectordatastore.service.RedisOperations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint para enfileiramente de upsert
 */
@RestController
@RequestMapping("/upsert")
public class UpsertResource {

    @Value("${upsert.queue}")
    private String queue;

    @Autowired
    RedisOperations redisOperations;

    @PostMapping
    public ResponseEntity<ResponseUpsertDatastore> upsert(@RequestBody RequestUpsertDataDatastore request){

        if(redisOperations.sendMessageQueue(queue, request)){

            return new ResponseEntity<>(new ResponseUpsertDatastore("ok", Boolean.TRUE), HttpStatus.OK);
        } else {

            return new ResponseEntity<>(new ResponseUpsertDatastore("error", Boolean.FALSE), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
