# Build
FROM hseeberger/scala-sbt:11.0.5_1.3.7_2.12.10 as build
WORKDIR /app
COPY /build.sbt .
COPY /project/ ./project
COPY /lib/scala ./lib/scala/
COPY /app/geo/ ./app/geo/
RUN sbt "project geoApp" playUpdateSecret dist

# Deployment
FROM ubuntu:18.04

RUN apt-get update && apt-get install -y default-jre-headless unzip

COPY --from=build /app/app/geo/target/universal/geo-app-1.0.0-SNAPSHOT.zip /
RUN unzip -q geo-app-1.0.0-SNAPSHOT.zip && mv /geo-app-1.0.0-SNAPSHOT /app && chmod +x /app/bin/geo-app

EXPOSE 9000

ENTRYPOINT ["/app/bin/geo-app"]
