# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR from the builder stage
COPY --from=builder /app/target/signal-intelligence-0.0.1-SNAPSHOT.jar app.jar

# Copy the CSV file
RUN mkdir -p src/main/resources
COPY src/main/resources/655.csv src/main/resources/655.csv

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
