# frontend/Dockerfile
FROM node:16-alpine as build

WORKDIR /app

# Create necessary directories and set permissions
RUN mkdir -p /app/node_modules/.cache && \
    chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80