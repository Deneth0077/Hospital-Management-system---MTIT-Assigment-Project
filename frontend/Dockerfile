
# Stage 1: Build React/Vite
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
# Copy build files from build-stage to Nginx public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Use default 80 port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
