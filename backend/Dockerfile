# FROM node:18-alpine

# WORKDIR /app

# COPY package.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies inside Docker
RUN npm install

# Copy application source code
COPY . .

# Application runs on port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]