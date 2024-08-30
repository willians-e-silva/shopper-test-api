# Use a imagem base do Node.js
FROM node:20

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta que a aplicação irá rodar
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]