FROM node:18-alpine

WORKDIR /app

# Install the serve package globally to serve static files
RUN npm install -g serve

# Copy all project files into the container
COPY . .

# Expose port 3000 (standard, Render will route the HTTP traffic automatically)
EXPOSE 3000

# Run the server, binding to the dynamic PORT environment variable provided by Render
CMD ["sh", "-c", "serve -l $PORT"]
