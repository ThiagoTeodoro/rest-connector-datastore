#!/bin/sh

redis-server --daemonize yes
sleep 30
java -Duser.language=pt -Duser.country=BR -Duser.timezone=GMT-3 -jar rest-connector-datastore-0.0.1-SNAPSHOT.jar