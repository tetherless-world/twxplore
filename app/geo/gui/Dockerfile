# Build
FROM tiangolo/node-frontend:10 as build
WORKDIR /app
COPY /package.json .
COPY /lerna.json .
COPY /lib/ts ./lib/ts
COPY /app/geo/gui ./app/geo/gui
RUN npm install
RUN npm run lerna:bootstrap
RUN cd lib/ts/base && npm run build
RUN cd app/geo/gui && npm run build
# RUN cd app/geo/gui && npm run build-development-unix

# Deployment
FROM nginx:1.17.6

COPY /app/geo/gui/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/app/geo/gui/dist /usr/share/nginx/html

EXPOSE 80
