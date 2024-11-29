# Event Management System API

## Description
A comprehensive event management system built with NestJS, featuring user authentication, event management, and registration handling.

## Features
- 🔐 User Authentication (Register/Login)
- 📅 Event Management (CRUD operations)
- ✍️ Event Registration System
- 📄 PDF Generation for Event Details
- 🔒 JWT-based Authorization
- 📚 Swagger API Documentation

## Technologies Used
- NestJS v10
- MongoDB with Mongoose
- JWT Authentication
- Swagger/OpenAPI
- PDFKit for PDF generation

## Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/elFilaly001/Evently.git
```
```bash
cd Evently
```

2. Install dependencies
```bash
cd Nest Back-end
npm install
cp .env.example .env
```
```bash
cd ..
cd Front-end
npm install
cp .env.example .env
```

3. build the containers
```bash
cd ..
docker compose up --build
```

## API Documentation
The API documentation is available via Swagger UI at:
`http://localhost:3000/api-docs`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Events
- POST `/api/event/addEvent` - Create a new event
- GET `/api/event/:id` - Get events by user ID
- PUT `/api/event/:id` - Update an event
- DELETE `/api/event/:id` - Delete an event
- GET `/api/event/download/:id` - Download event details as PDF

### Inscriptions
- POST `/api/inscription/addInscription` - Register for an event
- GET `/api/inscription/:id` - Get registrations for an event
- PUT `/api/inscription/:id` - Update a registration
- DELETE `/api/inscription/:id` - Cancel a registration

## Authentication
The API uses JWT tokens for authentication. Include the token in the Authorization header:


## Data Models

### User

{
  "username": "string",
  "email": "string",
  "password": "string"
}

### Event 

{
  "title": "string",
  "description": "string",
  "date": "date",
  "location": "string",
  "participants": "array"
}

### Inscription

{
  "eventId": "string",
  "participant": "object"
}

## Error Handling
The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Security Features
- Password Hashing (bcrypt)
- JWT Authentication
- Request Validation
- CORS Protection

## Development

### Running Tests

```bash
cd Nest Back-end
npm test
```

### Project Structure

### Back-end
src/
├── auth/ # Authentication module
|    ├── controllers/ # controllers
|    ├── dto/ # data transfer objects
|    ├── entities/ # entities
|    ├── guards/ # guards
|    ├── services/ # services
|    └── auth.module.ts # module
├── event/ # Event management module
|    ├── controllers/ # controllers
|    ├── dto/ # data transfer objects
|    ├── entities/ # entities
|    ├── guards/ # guards
|    ├── services/ # services
|    └── event.module.ts # module
├── inscription/ # Registration module
|    ├── controllers/ # controllers
|    ├── dto/ # data transfer objects
|    ├── entities/ # entities
|    ├── guards/ # guards
|    ├── services/ # services
|    └── inscription.module.ts # module
├── app.module.ts # Main application module
└── main.ts # Application entry point

### Front-end
src/
├── components/ # UI components
├── assets/ # Static assets
├── services/ # services
|    └── axiosInstance.ts # axios instance
├── pages/ # pages
├── router/ # router
|   ├── protected/ # protected routes
|   └── router.ts # router
├── store/ # Redux store
|    ├── slices/ # slices
|    └── store.ts # store
├── App.vue # Main application component
└── main.js # Application entry point

