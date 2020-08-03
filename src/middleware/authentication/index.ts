import { Request, Response, NextFunction } from "express";

export default function AuthenticationMiddleware(req: Request, res: Response, next: NextFunction){

    try {

        //Esse processo de autenticação está assim hoje sem muito 'zelo' por que a API ainda não é nossa maneira oficial de produção
        //Se isso mudar, precisamos implementar uma lógica minima de TokenJWT com BD de usuários para a API.

        const {authorization} = req.headers;

        if(authorization=="YXV0b3JpemHDp8Ojb3Byb3Zpc29yaWExMjM0NTY="){

            //Requisição autorizada
            next();

        } else {

            //Requisição não autorizada            
            return res.status(401).send({error: `Não autorizado!`});
        }
    } catch(error) {

        console.error(error);
        return res.status(500).send({error: 'Internal Server Error'});
    }
}
