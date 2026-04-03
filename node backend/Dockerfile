
FROM node:20-alpine
WORKDIR /app

# Configure npm with increased timeout
RUN npm config set fetch-timeout 60000 && npm config set fetch-retry-mintimeout 20000 && npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./
RUN npm install || npm install
COPY . .
# Expose Port (Standard 5000 as configured in server.js)
EXPOSE 5000
CMD ["npm", "start"]
