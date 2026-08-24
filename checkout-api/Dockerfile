FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
# Todos os módulos do serviço, não só o server.js: o import do meta-capi.js
# quebra o boot se o arquivo não entrar na imagem.
COPY *.js ./
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
