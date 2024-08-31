# Projeto Shopper API Test

**Esse projeto foi criado com base no desafio enviado pela Shopper.com.br, desde já agradeço a oportunidade.**

## Descrição

Como proposto, esse projeto utiliza Node junto com TypeScript para criar uma API de fácil acesso que possibilita o envio de imagens em Base64 para a API do Vision e com seu retorno encaminha para a API do Gemini, podendo obter o valor do relógio na imagem.

## Como Usar?

1. Passe as variáveis de ambiente necessárias para o `.env` do projeto, use example.env para criar um.
2. Rode o comando:
   ```sh
   docker-compose up
   ```
3. Pronto, o projeto está rodando e pode ser acessado pelo `localhost:{PORTA INFORMADA NO ENV}`.

Vale ressaltar que o banco de dados também roda em um container no Docker. Se necessário, altere o `docker-compose.yml` para subir apenas a API e informe a conexão no arquivo `.env`.

## Problemas e Soluções

### Não Funcionou!!! E Agora?

O script do Docker salva alguns caches em volume/container/imagens, etc. Portanto, se algo não funcionar conforme o esperado, tente rodar o seguinte script antes de tentar novamente:

```sh
docker-compose down
docker volume prune -f
docker network prune -f
docker rmi $(docker images -q)
docker rm $(docker ps -a -q)
docker system prune -a -f
```

### A API Não Funcionou!!!

- Tenha certeza de estar passando a API Key correta com as permissões necessárias.
- Tenha certeza que sua key possui privilégios para usar o modelo: [`emini-1.5-pro-latest`] e fazer requisições para o [`GoogleAIFileManager`]

## Considerações Finais

Acabei me empolgando um pouco demais com o projeto, me diverti com o desafio proposto e tentei fazer o melhor que pude em cada parte do código. Espero que se divirta testando assim como eu me diverti codando.

**OBS:** Desde já peço perdão por não entregar os adicionais do projeto, como trabalho em dia de semana tive poucas horas por dia para focar 100% no desafio.

**OBS 2:** Notei que na segunda rota, ao não encontrar a leitura, a mensagem de `error_description` está duplicada com a de leitura confirmada: sendo "Leitura do mês já realizada". Alterei no código para: `leitura não encontrada`.

