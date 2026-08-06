FROM node:22-alpine

WORKDIR /app

# Copy workspace manifests
COPY package*.json ./

# Copy the shared package
COPY packages ./packages

# Copy the service
COPY webhook-service ./webhook-service

# Install all workspace dependencies
RUN npm install

WORKDIR /app/webhook-service

EXPOSE 5002

CMD ["npm", "start"]