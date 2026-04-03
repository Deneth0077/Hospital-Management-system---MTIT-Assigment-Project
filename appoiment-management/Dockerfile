FROM node:18-alpine

WORKDIR /usr/src/app

# Configure npm with increased timeout
RUN npm config set fetch-timeout 60000 && npm config set fetch-retry-mintimeout 20000 && npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./

# Install with retry
RUN npm install --legacy-peer-deps || npm install --legacy-peer-deps

COPY . .

EXPOSE 5002

CMD ["npm", "start"]
