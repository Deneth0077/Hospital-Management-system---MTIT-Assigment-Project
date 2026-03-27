# Stage 1: Build React/Vite
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Pass build arguments for Vite
ARG VITE_AUTH_API_URL
ARG VITE_WARD_API_URL
ARG VITE_DOCTOR_API_URL
ARG VITE_PATIENT_API_URL
ARG VITE_APPOINTMENT_API_URL
ARG VITE_PHARMACY_API_URL
ARG VITE_LAB_API_URL

# Set them as environment variables for the build process
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_WARD_API_URL=$VITE_WARD_API_URL
ENV VITE_DOCTOR_API_URL=$VITE_DOCTOR_API_URL
ENV VITE_PATIENT_API_URL=$VITE_PATIENT_API_URL
ENV VITE_APPOINTMENT_API_URL=$VITE_APPOINTMENT_API_URL
ENV VITE_PHARMACY_API_URL=$VITE_PHARMACY_API_URL
ENV VITE_LAB_API_URL=$VITE_LAB_API_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy build files from build-stage to Nginx public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Use default 80 port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
