import datastoreConnection from '../../database/datastore';


/**
 * Repositorio de operações com o Datastore
 */
export default class DatastoreRepository {


    /**
     * Função repsonsável por consultar os dados no Datastore.
     * 
     * @param entity 
     * @param keyToCheck 
     * @param valueToCheck 
     */
    public async selectEntity(entity: string, keyToCheck: string, valueToCheck: any): Promise<Array<any>> {

        var resultQuery: Array<any> = [];
        const connection = datastoreConnection();
        const transaction = connection.transaction();
        await transaction.run();

        try{

            const query = transaction.createQuery(entity).filter(keyToCheck, "=", valueToCheck);
            const [returns] = await transaction.runQuery(query);
            transaction.commit();
        
            //Varrendo resultados.
            for (let aux of returns) {

                resultQuery.push(aux);
            }

            return resultQuery;
        } catch (error) {

            new Error(`Ocorreu um problema ao tentar executar DatastoreRepository.selectEntity ${error}.`);
            transaction.rollback();
            return resultQuery;
        }        
    }


    /**
     * Função reponsável por inserir novas Entities
     * 
     * @param entity 
     * @param object 
     */
    public async insertEntity(entity: string, object: any): Promise<boolean>{
        
        const connection = datastoreConnection();

        const transaction = connection.transaction();
        await transaction.run();

        try {

            const entityKey = connection.key(entity);

            const newEntity = {
                key: entityKey,
                data: object,
            };

            //Async Insert            
            transaction.insert(newEntity);                

            transaction.commit();
            return true;
        } catch (error) {
            
            new Error(`Ocorreu um problema ao tentar executar DatastoreRepository.insertEntity ${error}.`);
            transaction.rollback();
            return false;
        }
    }


    /**
     * Função reponsável por inserir novas Entities
     * 
     * @param entity 
     * @param id 
     * @param object 
     */
    public async updateEntity(entity: string, idObject: any, object: any): Promise<boolean> {
        
        const connection = datastoreConnection();
        const transaction = connection.transaction();
        await transaction.run();

        try {

            const keyUpdate = transaction.key(
                [
                    entity, 
                    connection.int(idObject[connection.KEY].id)
                ]
            );
    
            const updateEntity = {
                key: keyUpdate,
                data: object,
            }
    
            //Async Update
            transaction.update(updateEntity);

            transaction.commit();
            return true;
        } catch(error) {
            
            new Error(`Ocorreu um problema ao tentar executar DatastoreRepository.updateEntity ${error}.`);
            transaction.rollback();
            return false;
        }
    }


    /**
     * Serviço responsável pelas operações de Upsert no Datastore
     * 
     * @param entity
     * @param key 
     * @param object 
     */
    public async upsert(entity: string, key: any, object: any): Promise<boolean>{

        const connection = datastoreConnection();
        const transaction = connection.transaction();
        await transaction.run();

        try{

            const objectKey = connection.key(
                [                                                             
                    entity,
                    key,
                ]
            );

            const data = {
                key: objectKey,
                data: object
            }            

            //Async upsert
            transaction.upsert(data);
            transaction.commit();

            return true;
        } catch (error){

            new Error(`Ocorreu um problema ao tentar executar DatastoreRepository.upsert ${error}.`);
            transaction.rollback();
            return false;
        }
    }

}