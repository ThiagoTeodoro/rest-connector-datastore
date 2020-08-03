#Versão do node que vamos usar.
FROM node:12
LABEL maintainer="thiago.rodrigues@callink.com.br"


#Redis

RUN wget http://download.redis.io/redis-stable.tar.gz && \
    tar xvzf redis-stable.tar.gz && \
    cd redis-stable && \
    make && \
    mv src/redis-server /usr/bin/ && \
    cd .. && \
    rm -r redis-stable && \
    npm install -g concurrently   

EXPOSE 6379

#NodeJS

#Criando as pastas onde será copiados os arquivos e instalada as dependências estamos 
#fazendo isso separadamente pois assim garantimos as permissões de usuários internos
#do container com o chown -R nessa linha.
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

#Definindo diretório de trabalho.
WORKDIR /home/node/app

#Copiando apenas o package.json e o package-lock.json para dentro container.
COPY package*.json ./

#Instalando as dependências o container sem o código.
RUN npm install

#Copiando tudo que está na pasta do Dockerfile (Ou seja os fontes) para dentro do container no Workdir.
COPY . .

#Compilando Typescript para JS
RUN npm run-script build:linux

#Concedendo permissão em tudo para o usuário node.
COPY --chown=node:node . .

#Acionando o usuário node.
USER node

#Expondo a porta que está configurada lá no código da aplicação para uso.
EXPOSE 8080

#Dando permissão de execução
RUN chmod 777 start.sh

#Variaveis de Ambiente
#SERVER CONFIG'S
ENV PORT=8080

#GCLOUD CONFIG
ENV PROJECT_ID=''
ENV PATH_KEY_FILE=''

#REDIS CONFIG
ENV HOST_REDIS=127.0.0.1
ENV PORT_REDIS=6379
ENV QUEUE_NAME='datastoreQueue'

#Comando para subir os servidores
CMD ["./start.sh"]