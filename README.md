# Organization Tree API

This project provides an API for managing an organization tree structure, where nodes represent locations, employees, and departments. The API is built with NestJS, uses PostgreSQL as the database, and can be run in development or production modes.

## Prerequisites

- **Node.js and npm**: Ensure you have Node.js installed.
- **PostgreSQL**: Install PostgreSQL for local development.
- **Docker (optional)**: For running the project in Docker.

## Setup

1. **Clone the Repository**

   ```bash
   git clone <repository_url>
   cd organization-tree
   ```

2. **Set Up Environment Variables**

   Create a `.env` file in the project root with the following variables. Update the values as needed for your local setup:

   ```env
   # .env
   DB_HOST=localhost            # Use 'localhost' for local PostgreSQL or 'host.docker.internal' when running with Docker
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=organizationtree

   NODE_ENV=development          # Change to 'production' for production mode
   PORT=3000                     # Port where the API will run
   ```

3. **Set Up PostgreSQL Database**

   Start PostgreSQL (if not already running).

   Create the Database: Connect to PostgreSQL and run:

   ```sql
   CREATE DATABASE organizationtree;
   ```

   Ensure the `.env` file has correct database credentials (matching your PostgreSQL setup).

## Development Mode

To run the project in development mode with hot-reloading:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the project in development mode:

   ```bash
   npm run start:dev
   ```

   Access the API at: [http://localhost:3000](http://localhost:3000)

   Swagger Documentation: [http://localhost:3000/api](http://localhost:3000/api)

## Production Mode

To run the project in production mode locally:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Run migrations:

   ```bash
   npm run migration:run
   ```

4. Start the application:

   ```bash
   npm run start:prod
   ```

   Access the API at: [http://localhost:3000](http://localhost:3000)

   Swagger Documentation: [http://localhost:3000/api](http://localhost:3000/api)

## Running with Docker

1. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images and start the containers as defined in your `docker-compose.yml` file.

2. Access the API at: [http://127.0.0.1:3000](http://127.0.0.1:3000)

   Swagger Documentation: [http://127.0.0.1:3000/api](http://127.0.0.1:3000/api)

3. Environment Variables for Docker

Ensure `DB_HOST=host.docker.internal` in your `.env` file if you're using a local PostgreSQL instance with Docker. This setting allows the Docker container to connect to your local PostgreSQL database.

## Commands Summary

| Command                     | Description                  |
|-----------------------------|------------------------------|
| npm install                 | Install dependencies         |
| npm run start:dev           | Run in development mode      |
| npm run build               | Build the project            |
| npm run migration:run       | Run migrations               |
| npm run start:prod          | Start in production mode     |
| docker-compose up --build   | Build and run with Docker    |


