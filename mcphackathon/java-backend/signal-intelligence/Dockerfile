FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the JAR file
COPY target/signal-intelligence-0.0.1-SNAPSHOT.jar app.jar

# Create the resources directory structure and copy CSV file
RUN mkdir -p src/main/resources
COPY src/main/resources/655.csv src/main/resources/655.csv

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]