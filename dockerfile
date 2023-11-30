# Usa l'immagine Docker di Puppeteer
FROM ghcr.io/puppeteer/puppeteer:21.5.2

# Crea e imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia il file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm ci

# Copia il resto del codice nell'immagine Docker
COPY . .

# Esponi la porta su cui il tuo server Node.js sarà in ascolto
EXPOSE 3000

# Comando per avviare l'applicazione
CMD ["node", "server.js"]