# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed dependencies
RUN npm install --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on (if needed)
EXPOSE 3000

# Set the command to run the app
CMD ["node", "client.js"]
