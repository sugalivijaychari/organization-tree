# Stage 1: Build the application
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the project
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

WORKDIR /app

# Copy only the build output and necessary files from the previous stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/tsconfig.build.json ./

# Expose the application port
EXPOSE 3000

# Run migrations and start the application
CMD npm run migration:run:prod && npm run start:prod
