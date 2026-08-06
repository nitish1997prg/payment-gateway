FROM node:22-alpine

WORKDIR /app

# Copy workspace manifests
COPY package*.json ./

# Copy the shared package
COPY packages ./packages

# Copy the service
COPY analytics-service ./analytics-service

# Install all workspace dependencies
RUN npm install

WORKDIR /app/analytics-service

EXPOSE 5001

CMD ["npm", "start"]