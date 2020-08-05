import App from './app';
import cluster from 'cluster';
import os from 'os';
import RsmqService from './service/rsmq-service';
import dotenv from 'dotenv';
import DatastoreRecordJob from './jobs/datastore-record';

//Carregando variaveis de ambiente
dotenv.config();

//Criando fila no Redis para ser utilizada
const rsmqService = new RsmqService();
rsmqService.createQueue(String(process.env.QUEUE_NAME));

//Iniciando aplicação em um novo Worker Process do nosso Cluster
console.log("Iniciando Servidor...")
App();

//Iniciando processamento assincrono das mensagens infileiradas
DatastoreRecordJob();
