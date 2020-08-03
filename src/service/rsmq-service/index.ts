import RedisSMQ from 'rsmq';
import dotenv from 'dotenv';

export default class RsmqService {

    private rsmqConnection: RedisSMQ;

    /**
     * Construtor padrão da classe.
     */
    constructor() {

        //Carregando variaveis de ambiente
        dotenv.config()

        //Conexão com o Redis.
        this.rsmqConnection = new RedisSMQ({ host: process.env.HOST_REDIS, port: Number(process.env.PORT_REDIS), ns: "rsmq" });

    }

    /**
     * Serviço para enviar uma mensagem para a FIFO no REDIS
     * 
     * @param message 
     * @param queueName
     */
    public sendMessageToFiFo(queueName: string, message: any): void {

        try {

            this.rsmqConnection.sendMessage({ qname: queueName, message: JSON.stringify(message) }, function (error, resp) {

                if (error) {

                    console.error(`Ocorreu um erro ao tentar enviar a mensagem para a Fila ${queueName}: Error ${error}`);
                    new Error(`Ocorreu um erro ao tentar enviar a mensagem para a Fila ${queueName}: Error ${error}`);
                }
            });
        } catch (error) {

            console.log(`Aconteceu um erro inesperado ao tentar enviar uma mensagem para a fila ${queueName}. Error ${error}`);
            new Error(`Aconteceu um erro inesperado ao tentar enviar uma mensagem para a fila ${queueName}. Error ${error}`);
        }
    }


    /**
     * Serviço responsável por receber uma mensagem e apagar essa mesma mensagem
     * da fila.
     * 
     * @param fn
     * @param queueName 
     */
    public async popMessage(queueName: string, fn: Function): Promise<void> {

        this.rsmqConnection.popMessage({ qname: queueName }, async function (err, resp: any) {

            if (err) {

                console.error(err)
                return
            }

            if (!resp.id) {

                //console.log("Fila vazia...")
                return
            };

            //Executando função enviada
            await fn(resp);
            return
        });
    }

    /**
     * Serviço responsável por criar a fila no redis, essa é a fila que será usada 
     * pelos serviços.
     * 
     * @param queueName
     */
    public createQueue(queueName: string): void {

        try {

            this.rsmqConnection.createQueue({ qname: queueName }, function (error, resp) {

                if (error) {

                    console.error(`Error ao tentar criar a Fila no Redis: Error : ${error}`);
                    new Error(`Error ao tentar criar a Fila no Redis: Error : ${error}`)
                }

                if (resp === 1) {

                    console.log(`Fila ${queueName} criada com sucesso!`);
                }
            });
        } catch (error) {

            console.log(`Aconteceu um erro inesperado ao tentar criar a fila ${queueName}. Error ${error}`);
            new Error(`Aconteceu um erro inesperado ao tentar criar a fila ${queueName}. Error ${error}`);
        }
    }


    /**
     * Serviço responsável por devolver informacões de uma fila
     * 
     * @param queueName 
     */
    public infoQueue(queueName: String): void {

        try {

            this.rsmqConnection.getQueueAttributes({ qname: String(queueName) }, function (error, resp) {

                if (error) {

                    console.error(`Erro ao tentar recuperar os dados da Fila ${queueName}. Error: ${error}.`);
                    new Error(`Erro ao tentar recuperar os dados da Fila ${queueName}. Error: ${error}.`);
                }

                console.log("==============================================");
                console.log("=================Queue Stats==================");
                console.log("==============================================");
                console.log("visibility timeout: ", resp.vt);
                console.log("delay for new messages: ", resp.delay);
                console.log("max size in bytes: ", resp.maxsize);
                console.log("total received messages: ", resp.totalrecv);
                console.log("total sent messages: ", resp.totalsent);
                console.log("created: ", resp.created);
                console.log("last modified: ", resp.modified);
                console.log("current n of messages: ", resp.msgs);
                console.log("hidden messages: ", resp.hiddenmsgs);
            });
        } catch (error) {

            console.error(`Aconteceu um erro inesperado ao tentar recuperar informações da fila ${queueName}. Error: ${error}.`)
            new Error(`Aconteceu um erro inesperado ao tentar recuperar informações da fila ${queueName}. Error: ${error}.`);
        }
    }

}