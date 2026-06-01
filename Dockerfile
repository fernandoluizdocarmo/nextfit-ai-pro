FROM node:18-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all project files into the container
COPY . .

# Expose port 3000 (standard, Render will route the HTTP traffic automatically)
EXPOSE 3000

# Run the custom Express server with keep-alive
CMD ["node", "server.js"]
