import {Datastore} from '@google-cloud/datastore';
import dotenv from 'dotenv';

export default function datastoreConnection(): Datastore {

    //Carregando variaveis de ambiente
    dotenv.config();

    return new Datastore({
        projectId: process.env.PROJECT_ID,
        keyFilename: process.env.PATH_KEY_FILE
    });
}