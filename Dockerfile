#Versão do node que vamos usar.
FROM openjdk:11
LABEL maintainer="thiago.rodrigues@callink.com.br"

#Redis

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

RUN apt-get install -y pkg-config

RUN apt-get update && apt-get install make

RUN apt-get -y install gcc

RUN apt -y install build-essential apt-transport-https lsb-release ca-certificates curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -

RUN apt-get install -y nodejs

RUN wget http://download.redis.io/redis-stable.tar.gz && \
    tar xvzf redis-stable.tar.gz && \
    cd redis-stable && \
    make && \
    mv src/redis-server /usr/bin/ && \
    cd .. && \
    rm -r redis-stable && \
    npm install -g concurrently   

EXPOSE 6379

#Java
COPY rest-connector-datastore-0.0.1-SNAPSHOT.jar /
COPY keyFile.json /
COPY start.sh /
RUN chmod +x start.sh

#Comando para subir os servidores
CMD ["./start.sh"]