# Step 1: Build the NestJS application
FROM node AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the NestJS application
RUN npm run build

CMD [ "npm", "run", "start:dev" ]

# Step 2: Create the production image
FROM node AS production

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json to install only production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the built application from the previous step
COPY --from=build /app/dist ./dist

# Expose the application port (default is 3000)
EXPOSE 3000

# Command to run the NestJS application

CMD [ "npm", "run", "start:dev" ]
