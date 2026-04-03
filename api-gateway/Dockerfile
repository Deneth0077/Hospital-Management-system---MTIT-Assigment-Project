# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Configure npm with increased timeout
RUN npm config set fetch-timeout 60000 && npm config set fetch-retry-mintimeout 20000 && npm config set fetch-retry-maxtimeout 120000

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production || npm install --production

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"]
