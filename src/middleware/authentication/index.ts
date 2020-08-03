import { Request, Response, NextFunction } from "express";

export default function AuthenticationMiddleware(req: Request, res: Response, next: NextFunction){

    try {

        //Esse processo de autenticação está assim hoje sem muito 'zelo' por que a API ainda não é nossa maneira oficial de produção
        //Se isso mudar, precisamos implementar uma lógica minima de TokenJWT com BD de usuários para a API.

        const {authorization} = req.headers;

        if(authorization=="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImNsay10ZXN0In0.31eoHKevCNqSCExUV-Px1Voye5j0vWYTy6Zop3mLiYY"){

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