# Use Node.js LTS version as base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app
# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 5173
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]
