package br.com.restconnectordatastore.runner;

import br.com.restconnectordatastore.model.RequestUpsertDataDatastore;
import br.com.restconnectordatastore.service.DatastoreOperations;
import br.com.restconnectordatastore.service.RedisOperations;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Consumer que fica checando as mensagens para fazer gravação async
 */
@Component
public class ConsumerUpsertDatastore implements CommandLineRunner {

    @Value("${upsert.queue}")
    private String queue;

    @Autowired
    RedisOperations redisOperations;

    @Autowired
    DatastoreOperations datastoreOperations;

    private ObjectMapper mapper = new ObjectMapper();

    /**
     * Execução do consumer para upsert.
     * @param args
     * @throws Exception
     */
    @Override
    public void run(String... args) throws Exception {

        //Loop Infinito com sleep entre operações de 50 milésimos de segundo.
        while(true){

            String message = redisOperations.popMessageQueue(queue);
            if(message!=null){

                RequestUpsertDataDatastore requestUpsertDataDatastore = mapper.readValue(message, RequestUpsertDataDatastore.class);
                datastoreOperations.asyncUpsertDatastore(requestUpsertDataDatastore);
            } else {

                //Não temos mensagem na fila.
            }

            Thread.sleep(50);
        }
    }
}
