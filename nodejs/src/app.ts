import express from 'express';
import dotenv from 'dotenv';
import Routes from './routes';

/**
 * Função responsável por iniciar e controlar o servidor REST API.
 */
export default function App(): void {

    //Carregando variaveis de ambiente
    dotenv.config();

    const app = express();

    //Configurando API para utilizaçãó do Padrão JSON
    app.use(express.json());

    //Confiurando Rotas
    app.use(Routes());

    app.listen(process.env.PORT, () => {
        
        console.info(`Servidor em execução na porta : ${process.env.PORT}.`);
    });
}