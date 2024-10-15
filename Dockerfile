# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN pnpm build

# Expose the port your app runs on
EXPOSE 8080

# Define the command to run your app
CMD ["pnpm", "serve"]