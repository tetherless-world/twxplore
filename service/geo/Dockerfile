FROM hseeberger/scala-sbt:11.0.4_1.3.5_2.12.10 as build
WORKDIR /app
COPY /build.sbt .
COPY /project/ ./project
COPY /service/lib/ ./service/lib/
COPY /service/geo/ ./service/geo/
RUN sbt "project geo" playUpdateSecret dist


FROM openjdk:11-jre

COPY --from=build /app/service/geo/target/universal/geo-1.0.0-SNAPSHOT.zip /
RUN unzip -q geo-1.0.0-SNAPSHOT.zip && mv /geo-1.0.0-SNAPSHOT /app && chmod +x /app/bin/geo

EXPOSE 9000

CMD ["/app/bin/geo"]
