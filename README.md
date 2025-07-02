# Kenility Challenge

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone git@github.com:lmdl25/kenility-challenge.git
   ```

2. **Create Environment File:**
   Copy the contents of `env.example` and create a `.env` file in the project root.
3. **Build and Run with Docker Compose:**

   ```bash
   sudo docker-compose up -d --build
   ```

## Running the Application

- **Start:** `docker-compose up -d`
- **Stop:** `docker-compose down`

This project is a sample NestJS application demonstrating:

- User authentication using JWT (JSON Web Tokens).
- Integration with MongoDB using Mongoose for data persistence.
- Object storage using MinIO for handling file uploads (specifically product images).
- Automated environment setup using Docker and Docker Compose.
- API documentation using Swagger (OpenAPI).

## API Documentation (Swagger)

Once the application is running (specifically the `nest-app` container), you can access the Swagger UI in your browser. Navigate to:

`http://localhost:<PORT>/docs`

(Replace `<PORT>` with the port your NestJS application is running on, typically 4000 as defined in your `.env` or `docker-compose.yml`).

The Swagger UI allows you to interactively explore the API endpoints, view request/response schemas, and even execute requests (including file uploads).

## Features

- **Authentication:** Secure endpoints using JWT (`@nestjs/jwt`, `bcryptjs`). Includes `JwtAuthService` for token handling and `JwtAuthGuard` for route protection.
- **User/Product Management:** Basic setup for managing resources (example focused on Products).
- **Image Upload:** Endpoint for uploading product images (`multipart/form-data`) directly to a MinIO bucket.
- **Database Integration:** Uses Mongoose (`@nestjs/mongoose`) for MongoDB interaction. Includes common fields like `_id`, `createdAt`, `updatedAt`, `__v`, and `deletedAt` (for soft deletes) documented via a `BaseResponseEntity`.
- **Object Storage:** Integrates with MinIO for storing uploaded files. Includes `MinioService` to abstract interactions.
- **Containerized Environment:** Uses Docker Compose to easily set up and run the NestJS application, MongoDB database, and MinIO object storage.
- **Automated Bucket Setup:** Includes a Docker Compose service (`createbuckets`) using the MinIO Client (`mc`) to automatically create the required MinIO bucket and set its access policy on startup.
- **API Documentation:** Automatically generated and interactive API documentation available via Swagger UI (`@nestjs/swagger`).

## Tech Stack

- **Backend:** NestJS (TypeScript)
- **Database:** MongoDB (with Mongoose)
- **Object Storage:** MinIO
- **Authentication:** JWT (`@nestjs/jwt`, `bcryptjs`)
- **API Documentation:** Swagger (`@nestjs/swagger`)
- **Containerization:** Docker

## Docker Compose Services

This setup includes the following services defined in `docker-compose.yml`:

- `nest-app`: The main NestJS application container.
- `mongo`: The MongoDB database container. (You might need to configure persistence using volumes).
- `minio`: The MinIO object storage server container. Data is persisted using a Docker volume (`minio_data`).
- `createbuckets`: A short-lived container using the MinIO Client (`mc`) that runs after `minio` is healthy to automatically create the necessary bucket (`product-images`) and set its access policy.
