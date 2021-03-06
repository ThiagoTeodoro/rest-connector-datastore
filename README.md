# rest-connector-datastore

Connector REST para grande volume de gravação com o Google Datastore.

## Projeto

Esse projeto foi desenhado para a necessidade de gravar grande quantidade de dados por meio de operações de upsert no Google Cloud Datastore.
Seu fluxo principal está baseado em uma fila (FIFO), que armazena os dados que precisam ser processados (Gravados) e então entrega os mesmo
para um outro processo controlado que realiza cada operação unitariamente a cada 1 milésimo de segundo.

### Arquitetura 

![Arquitetura](https://github.com/ThiagoTeodoro/rest-connector-datastore/blob/master/rest-connector-datastore-arq-fluxograma.png)

### Deploy

O Deploy desse projeto ou entrega é feito por meio de um arquivo Docker, nele contém as configurações necessárias do container e 
dos detalhes de implementação como por exemplo, nome da fila, porta da aplicação etc...
