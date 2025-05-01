# Etapa 1: Construção da imagem com o ambiente de desenvolvimento
FROM node:22-alpine AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas package.json e package-lock.json primeiro
COPY package*.json ./

# Instala as dependências de desenvolvimento
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o projeto TypeScript
RUN npx tsc

# Etapa 2: Construção da imagem de produção
FROM node:22-alpine AS production

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas o necessário do container builder 
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/uploads ./uploads

# Copia os arquivos necessários para hospedar a documentação na rota inicial
COPY --from=builder /app/src/templates ./dist/templates
COPY --from=builder /app/public ./public
COPY --from=builder /app/README.md ./

# Expõe a porta que o seu app usa
EXPOSE 80

# Roda as migrações e inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]