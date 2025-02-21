# Gadgets API

A RESTful API service for managing gadgets inventory with automatic success probability generation and status management.

## Features

- CRUD operations for gadgets management
- Automatic name generation for new gadgets
- Success probability calculation for each gadget
- Status tracking (Available, Deployed, Decommissioned, Destroyed)
- Swagger documentation
- Built with TypeScript and Express
- Prisma ORM for database management

## API Documentation

API documentation is available at:

- Production: https://uprasied-assignment.onrender.com/api/v1/docs
- Local: http://localhost:3000/api/v1/docs

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Swagger UI Express
- CORS

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- pnpm
- PostgreSQL database (local or a databse service e.g. neon or aiven)

### Installation

1. Clone the repository

```bash
git clone https://github.com/sambit826059/uprasied-assignment/
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
# Create a .env file and add:
DATABASE_URL="your-database-connection-string"
PORT=3000
```

4. Run Prisma migrations

```bash
pnpm dlx prisma migrate dev
```

5. Build the project

```bash
tsc -b
```

6. Start the server

```bash
node dist/index.js
```

## API Endpoints

### GET /api/v1/gadgets

Get a list of gadgets with success probabilities. Can be filtered by status.

Query Parameters:

- `status` (optional): Filter by gadget status (Available, Deployed, Decommissioned, Destroyed)

### POST /api/v1/gadgets

Add a new gadget to the inventory. Automatically generates a random name.

### PATCH /api/v1/gadgets

Update an existing gadget's information.

Request Body:

```json
{
  "id": "string",
  "name": "string",
  "status": "string"
}
```

### DELETE /api/v1/gadgets

Decommission a gadget from the inventory.

Request Body:

```json
{
  "id": "string"
}
```

## Deployment

The application is deployed on Render.com and available at:
https://uprasied-assignment.onrender.com

## Project Structure

```
src/
├── index.ts          # Application entry point
├── swagger.ts        # Swagger configuration
├── routes/
│   └── gadgets.ts    # Gadget routes and controllers
└── utils/
    ├── randomNameGenerator.ts
    └── codeGenerator.ts
```

## Error Handling

The API includes comprehensive error handling for:

- Invalid request parameters
- Database operation failures
- Resource not found scenarios
- Server errors
