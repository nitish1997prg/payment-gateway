FROM node:22-alpine

WORKDIR /app

# Copy workspace manifests
COPY package*.json ./

# Copy the shared package
COPY packages ./packages

# Copy the service
COPY payment-service ./payment-service

# Install all workspace dependencies
RUN npm install

WORKDIR /app/payment-service

EXPOSE 5000

CMD ["npm", "start"]