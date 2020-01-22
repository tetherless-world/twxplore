# Build back end
FROM hseeberger/scala-sbt:11.0.4_1.3.5_2.12.10 as build-app
WORKDIR /app
COPY /build.sbt .
COPY /project/ ./project
COPY /lib/scala ./lib/scala/
COPY /app/geo/ ./app/geo/
RUN sbt "project geoApp" playUpdateSecret dist

# Build front end
FROM tiangolo/node-frontend:10 as build-gui
WORKDIR /app
COPY /package.json .
COPY /lerna.json .
COPY /lib/ts ./lib/ts
COPY /app/geo/gui ./app/geo/gui
RUN npm install
RUN npm run lerna:bootstrap
RUN cd lib/ts/base && npm run build
RUN cd app/geo/gui && npm run build

# Deployment
FROM ubuntu:18.04

RUN apt-get update && apt-get install -y default-jre-headless nginx-full unzip

COPY /app/geo/nginx.conf /etc/nginx/sites-available/default

COPY --from=build-app /app/app/generic/target/universal/geo-app-1.0.0-SNAPSHOT.zip /
RUN unzip -q geo-app-1.0.0-SNAPSHOT.zip && mv /geo-app-1.0.0-SNAPSHOT /app && chmod +x /app/bin/geo-app

COPY --from=build-gui /app/app/geo/gui/dist /usr/share/nginx/html

EXPOSE 80

COPY /app/geo/docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
