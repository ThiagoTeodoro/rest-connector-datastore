package br.com.restconnectordatastore.service;

import br.com.restconnectordatastore.model.RequestUpsertDataDatastore;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.datastore.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;

/**
 * Operações com o Datastore.
 */
@Service
@Slf4j
public class DatastoreOperations {

    /**
     * Método async de gravação de dados no Datastore.
     */
    public void asyncUpsertDatastore(RequestUpsertDataDatastore requestUpsertDataDatastore){

        //Thread para melhor performance
        Thread thread = new Thread(){

            public void run(){

                try {

                    //Gerando conexão com o Datastore
                    Datastore datastore = DatastoreOptions.newBuilder()
                            .setCredentials(ServiceAccountCredentials.fromStream(new FileInputStream("keyFile.json")))
                            .build()
                            .getService();

                    //Gerando Key
                    KeyFactory keyFactory = datastore.newKeyFactory().setKind(requestUpsertDataDatastore.getEntity());
                    Key key = keyFactory.newKey((String) requestUpsertDataDatastore.getObject().get(requestUpsertDataDatastore.getKey()));

                    //Gerando Entidade (Documento)
                    Entity.Builder entityBuilder = Entity.newBuilder(key);
                    requestUpsertDataDatastore.getObject().entrySet().forEach(entry ->{

                        if(entry.getValue() != null) {

                            if (entry.getValue() instanceof Integer) {

                                entityBuilder.set(entry.getKey(), (Integer) entry.getValue());
                            } else if(entry.getValue() instanceof Double){

                                entityBuilder.set(entry.getKey(), (Double) entry.getValue());
                            } else if(entry.getValue() instanceof Boolean){

                                entityBuilder.set(entry.getKey(), (Boolean) entry.getValue());
                            } else {

                                entityBuilder.set(entry.getKey(), (String) entry.getValue());
                            }
                        }
                    });

                    //Criando entidade
                    Entity entity = entityBuilder.build();

                    //O Put caso a key seja a mesma realiza um upsert.
                    datastore.put(entity);
                } catch (Exception e){

                    log.error("Ocorreu um erro inesperado em DatastoreOperations.asyncUpsertDatastore(). Exeception : ", e);
                    e.printStackTrace();
                }
            }
        };

        thread.start();
    }
}
