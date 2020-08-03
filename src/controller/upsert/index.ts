import { Response, Request } from "express";
import dotenv from 'dotenv';
import RsmqService from '../../service/rsmq-service';

/**
 * Constroller para operação de upsert.
 */
export default class UpsertController {


    /**
     * Controlador responsável por receber uma mensagem e enfileirar a mesma
     * na Fila do Redis (FIFO) em memória.
     * 
     * @param req 
     * @param res 
     */
    public upsert(req: Request, res: Response): Response {

        try{

            //Carregando variaveis de ambiente
            dotenv.config();

            //Enfileirando mensagem para processamento FIFO
            const rsmqService = new RsmqService();
            rsmqService.sendMessageToFiFo(String(process.env.QUEUE_NAME), req.body);;

            return res.status(200).send({ status: 'ok', enqueue: true });
        } catch(error) {

            console.error("Ocorreu um erro inesperado em ExistController.upsert. Exception : " + error);
            return res.status(500).send({ error: 'Internal Server Error' });
        }
    }
}