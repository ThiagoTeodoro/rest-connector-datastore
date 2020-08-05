import RsmqService from "../../service/rsmq-service";
import DatastoreRepository from "../../repository/datastore";
import dotenv from 'dotenv';
import os from 'os';

/**
 * Job/Processo responsável por processar cada mensagem enfileirada recebida.
 */
export default function DatastoreRecordJob(): void {

    const rsmqService = new RsmqService();

    //Função com o processamento.
    const functionProcessMessage =  async function (message: any):Promise<boolean> {

        try {

            //Carregando variaveis de ambiente
            dotenv.config();
            
            const jsonMessage = JSON.parse(message.message);
            const datastoreRepository = new DatastoreRepository();

            const { entity, key, object } = jsonMessage;

            //Checando se todos os atributos estão presentes
            if(entity && key && object){

                const valueKey = object[key];

                //Checando se o valor da key informada está presente
                if(valueKey){
                    
                    await datastoreRepository.upsert(entity, valueKey, object);
                    return true;
                } else {

                    console.error(`Atributo ${key} não está presente em object, impossivel continuar!`);
                    return false;
                }
            } else {
                    
                console.error("Atributos entity, key e object são obrigatórios, impossivel continuar!");
                return false;
            }
        } catch (error) {

            console.error("Ocorreu um erro inesperado em DatastoreRecordJob.functionProcessMessage(). Exception : " + error);  
            return false;
        }
    }

    /**
     * Máximo de chamada por CORE que é possivel é uma chamada por milesimo de segundo,
     * aqui, vamos trabalhar com 10 mensagens por segundo, ou seja, uma chamada acada 100
     * milésimo de segundo.
     */
    setInterval(() => {

        //Chamando processo de POP e passando nossa função de processamento para ser executada.
        rsmqService.popMessage(String(process.env.QUEUE_NAME), functionProcessMessage);        
    }, 100);    

    
    /**
     * Exibindo quantidade de memória livre
     */
    setInterval(() =>{

        const {freemem} = os;
        const memMbFree = Number(freemem)  / 1024 / 1024;

        console.log(`Memória livre : ${memMbFree} MB`);
        rsmqService.infoQueue(String(process.env.QUEUE_NAME));

    }, 120000);
}