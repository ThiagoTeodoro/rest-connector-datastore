import express, { Router } from 'express';
import UpsertController from './controller/upsert';
import AuthenticationMiddleware from './middleware/authentication';
import InfoController from './controller/info';


export default function Routes(): Router{    

    const routes = express.Router();    

    const existController = new UpsertController();
    const infoController = new InfoController();

    //Rotas
    routes.post('/upsert', AuthenticationMiddleware, existController.upsert);
    routes.post('/info', AuthenticationMiddleware, infoController.info);

    return routes;
}