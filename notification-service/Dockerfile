FROM node:22-alpine

WORKDIR /app

# Copy workspace manifests
COPY package*.json ./

# Copy the shared package
COPY packages ./packages

# Copy the service
COPY notification-service ./notification-service

# Install all workspace dependencies
RUN npm install

WORKDIR /app/notification-service

CMD ["npm", "start"]