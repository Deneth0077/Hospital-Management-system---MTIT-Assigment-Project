FROM node:18-alpine

WORKDIR /app

# Configure npm with increased timeout
RUN npm config set fetch-timeout 60000 && npm config set fetch-retry-mintimeout 20000 && npm config set fetch-retry-maxtimeout 120000

# Copy package files
COPY package*.json ./

# Install dependencies with retry
RUN npm install --legacy-peer-deps || npm install --legacy-peer-deps

# Copy application code
COPY . .

# Expose port
EXPOSE 5004

# Start the service
CMD ["npm", "start"]
