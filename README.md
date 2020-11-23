## Requisitos
* Docker
* Docker-compose

## Executando
```
git https://github.com/Ivoff/teste-pratico-nuti.git
cd ./teste-pratico-nuti
docker-compose up frontend
```

## Configuração
O arquivos de configuração ```.env``` na raiz do projeto define as portas expostas pelos servidores rodando a interface em Vue e o backend em Node.
### Detalhes
* O scripts sql na pasta ```domain/sql``` vão precisar ser alterados caso a configuração padrão de banco de dados seja alterada. Mais precisamente o nome no comando de criar e no comando de conectar-se ao banco.
* O serviço rodando a interface em Vue compartilha a rede do host.