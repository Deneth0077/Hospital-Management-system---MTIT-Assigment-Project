# Patient Service (Microservice)

Simple and beginner-friendly Node.js Patient Service for a Hospital Management System.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- REST API

## Port

- `3001`

## Folder Structure

```text
patient-service/
  src/
    config/
      db.js
    controllers/
      patientController.js
    middlewares/
      errorMiddleware.js
    models/
      Patient.js
    routes/
      patientRoutes.js
    app.js
    server.js
  .env.example
  package.json
  README.md
```

## API Endpoints

- `POST /patients` - Register a new patient
- `GET /patients` - Get all patients
- `GET /patients/:id` - Get patient by ID
- `PUT /patients/:id` - Update patient by ID
- `DELETE /patients/:id` - Delete patient by ID

## Environment Variables

Create a `.env` file from `.env.example`.

Example:

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/patients_db
DB_NAME=patients_db
NODE_ENV=development
```

## Sample JSON (POST /patients)

```json
{
  "fullName": "Nimal Perera",
  "age": 30,
  "gender": "Male",
  "phone": "+94-77-123-4567",
  "email": "nimal.perera@example.com",
  "address": "123, Main Street, Colombo",
  "bloodGroup": "O+",
  "dateOfBirth": "1995-04-10",
  "emergencyContactName": "Sunil Perera",
  "emergencyContactPhone": "+94-71-555-4444"
}
```

## Run the Project

1. Open terminal in `patient-service` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file and add your MongoDB values.
4. Run in development mode:
   ```bash
   npm run dev
   ```
5. Service will start on:
   - `http://localhost:3001`

## Notes

- Uses `async/await` for all database operations.
- Handles invalid MongoDB IDs safely.
- Uses structured JSON responses:
  ```json
  {
    "success": true,
    "message": "...",
    "data": {}
  }
  ```
