package br.com.restconnectordatastore.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

@Service
@Slf4j
public class RedisOperations {

    @Value("${redis.host}")
    private String redisHost;

    @Value("${redis.port}")
    private int redisPort;

    //Mapper Json Jackson
    private ObjectMapper objectMapper = new ObjectMapper();


    /**
     * Método responsável por enviar uma mensagem para uma Fila.
     *
     * @param queue
     * @param message
     * @return
     */
    public boolean sendMessageQueue(String queue, Object message){

        /*
                Estamos abrindo uma nova conexão a toda requisição
                por que o Jedis não é Thread Safe. Isso faz
                com que, diante de um grande numero de chamadas
                a biblioteca lance erro, realizando uma conexão por
                chamada isso não acontece.
             */
        Jedis jedisConnection = new Jedis(redisHost, redisPort);
        try{

            //Enviando dados para fila
            jedisConnection.rpush(queue, objectMapper.writeValueAsString(message));
            return true;
        } catch (Exception e){

            log.error("Ocorreu um erro inesperado em RedisOperations.sendMessageQueue(). Exception : ", e);
            e.printStackTrace();
            return false;
        } finally {

            jedisConnection.close();
        }
    }

    /**
     * Método responsável por realizar um POP de uma mensagem de um fila.
     *
     * (POP -> Obtem e exclui a mensagem da fila)
     *
     * Se o retorno for nulo siguinifica que a lista não tem dados.
     * @param queue
     * @return
     */
    public String popMessageQueue(String queue){

        /*
                Estamos abrindo uma nova conexão a toda requisição
                por que o Jedis não é Thread Safe. Isso faz
                com que, diante de um grande numero de chamadas
                a biblioteca lance erro, realizando uma conexão por
                chamada isso não acontece.
             */
        Jedis jedisConnection = new Jedis(redisHost, redisPort);
        try{

            //Retorna os dados na fila por POP ou retorna nulo se não tiver nada lá na fila.
            return jedisConnection.rpop(queue);
        } catch (Exception e){

            log.error("Ocorreu um erro inesperado em RedisOperations.popMessageQueue(). Exception : ", e);
            e.printStackTrace();
            return null;
        } finally {

            jedisConnection.close();
        }
    }

}
