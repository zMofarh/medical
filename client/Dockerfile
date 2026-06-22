# Stage 1: Build React/Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package descriptors first to cache npm installation layer
COPY package*.json ./
RUN npm ci

# Copy client source files
COPY . .

# Set dynamic API URL to relative '/api' so Nginx reverse-proxies automatically
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Production server using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production bundle from the builder stage
COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
