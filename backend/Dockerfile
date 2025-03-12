# backend/Dockerfile
FROM node:16-alpine

WORKDIR /app

# Create necessary directories and set permissions
RUN mkdir -p /app/markdown-downloads && \ 
    mkdir -p /app/node_modules && \
    chown -R node:node /app

# Ensure the non-root user has write permissions
RUN chmod -R 777 /app/markdown-downloads

USER node

COPY --chown=node:node package*.json ./
RUN npm install --production

COPY --chown=node:node . .

EXPOSE 5000
CMD ["node", "server.js"]