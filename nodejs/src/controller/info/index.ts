import { Response, Request } from "express";
import RsmqService from "../../service/rsmq-service";
import dotenv from 'dotenv';

export default class InfoController{

    
    /**
     * Controller responsavel por fornecer dados da Fila no OUTPUT SERVER não retorna JSON.
     * 
     * @param req 
     * @param res 
     */
    public info(req: Request, res: Response): Response {

        try {

            //Carregando variveis de ambiente
            dotenv.config();

            //Esse processo só consegui exibir log '-'
            const rsmqService = new RsmqService();
            rsmqService.infoQueue(String(process.env.QUEUE_NAME));

            return res.status(200).send({});

        } catch(error) {

            console.error("Ocorreu um erro inesperado em ExistController.upsert. Exception : " + error);
            return res.status(500).send({ error: 'Internal Server Error' });            
        }
    }

}