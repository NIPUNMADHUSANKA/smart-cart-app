# SmartCart API

Backend REST API for the SmartCart grocery shopping assistant, built with NestJS and Prisma.
This project demonstrates a modular backend architecture, JWT-based authentication,
and clean data access using Prisma ORM.

## Features
- User registration and login with JWT access tokens
- Password reset flow
- Category CRUD
- Shopping item CRUD with category filtering
- Global validation and exception filters

## Tech Stack
- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL (or any Prisma-supported database)
- JWT and Passport

## Architecture
- Modular NestJS structure with controllers, services, and DTOs
- Global validation pipe (whitelist + transform)
- Global exception handling

## Project Structure
```
src/
  auth/
  category/
  shopping-item/
  database/
  exceptions/
  global-filters/
  user/
prisma/
  schema.prisma
test/
```

## Getting Started
1. Install dependencies:
   `npm install`
2. Create a `.env` file (see Environment Variables).
3. Generate the Prisma client:
   `npx prisma generate`
4. Apply database migrations:
   `npx prisma migrate dev`
5. Start the server:
   `npm run start:dev`

The API will be available at `http://localhost:3000/api/smart-cart`.

## Environment Variables
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Authentication
Protected routes require a Bearer token:
`Authorization: Bearer <accessToken>`

## Key Endpoints
Base path: `/api/smart-cart`

Auth:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /auth/info`
- `PATCH /auth/resetPassword`
- `DELETE /auth/remove`

Auth (Passport-based):
- `POST /auth-v2/login`
- `GET /auth-v2/me`

Categories:
- `POST /category`
- `GET /category`
- `GET /category/:categoryId`
- `PATCH /category/:categoryId`
- `DELETE /category/:categoryId`

Shopping items:
- `POST /shopping-item`
- `GET /shopping-item`
- `GET /shopping-item/:itemId`
- `GET /shopping-item/findByCategory/:categoryId`
- `PATCH /shopping-item/:itemId`
- `DELETE /shopping-item/:itemId`

## Scripts
- `npm run start:dev` - run the API in watch mode
- `npm run build` - build the production bundle
- `npm run start:prod` - run the compiled app
- `npm test` - run unit tests
