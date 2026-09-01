# Stage 1: Build React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package specifications
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build production distribution
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
