FROM tiangolo/node-frontend:10 as build
WORKDIR /app
COPY /gui .
RUN npm install
RUN npm run lerna:bootstrap
RUN cd packages/lib && npm run build
RUN cd packages/generic && npm run build

# Deployment
FROM nginx:1.17.6
COPY /gui/packages/geo/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/geo/dist /usr/share/nginx/html
