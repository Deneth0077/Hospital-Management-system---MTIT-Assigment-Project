# ── Stage 1: Build ──────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies first (layer caching trick)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Run ────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/doctor-service-0.0.1-SNAPSHOT.jar doctor-service.jar

# Expose the service port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "doctor-service.jar"]