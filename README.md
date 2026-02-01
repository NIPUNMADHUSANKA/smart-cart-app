# SmartCart API

Backend REST API for the SmartCart grocery shopping assistant, built with NestJS and Prisma.
Includes AI-powered shopping list generation using the OpenAI API.

## Features
- User registration and login with JWT access tokens
- Password reset flow
- Category CRUD
- Shopping item CRUD with category filtering
- AI shopping list generation and confirmation into saved categories/items
- Global validation and exception filters

## Tech Stack
- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL (or any Prisma-supported database)
- JWT and Passport
- OpenAI API (chat completions)

## Architecture
- Modular NestJS structure with controllers, services, and DTOs
- Global validation pipe (whitelist + transform)
- Global exception handling

## Project Structure
```
src/
  ai-model/
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

## Requirements
- Node.js (LTS recommended)
- PostgreSQL (or a Prisma-supported database)
- OpenAI API key (required for AI endpoints)

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
OPENAI_API_KEY=your_openai_api_key
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

AI model (requires auth and `OPENAI_API_KEY`):
- `POST /ai-model` (body: `{ "prompt": "I want to cook fried rice for 2 people" }`)
- `GET /ai-model`
- `POST /ai-model/addAIShoppingItem`
- `PATCH /ai-model/updateAIShoppingItem`
- `POST /ai-model/regenerateAIShopping`
- `POST /ai-model/confirmAIShopping`
- `DELETE /ai-model/deleteAIShoppingItem/:categoryId/:itemId`
- `DELETE /ai-model/deleteAISuggestion/:suggestionId`
- `DELETE /ai-model/:categoryId`

## Scripts
- `npm run start:dev` - run the API in watch mode
- `npm run build` - build the production bundle
- `npm run start:prod` - run the compiled app
- `npm test` - run unit tests
