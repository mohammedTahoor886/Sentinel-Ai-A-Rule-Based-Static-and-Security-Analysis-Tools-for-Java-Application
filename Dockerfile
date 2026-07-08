FROM node:18-bullseye

# Install Java JDK
RUN apt-get update && apt-get install -y default-jdk

# Set the working directory
WORKDIR /app

# 1. Copy package files and install dependencies
# Note: Changed to 'sentinal-backend' to match your folder spelling
COPY sentinal-backend/package*.json ./
RUN npm install

# 2. Copy the rest of your backend source files
COPY sentinal-backend/ .

# 3. Find and compile SentinelCore.java wherever it is hidden
# This command automatically finds the file inside your directories and compiles it safely
RUN find . -name "SentinelCore.java" -exec javac {} +

# Expose port and start the node server
EXPOSE 5000
CMD ["node", "server.js"]
