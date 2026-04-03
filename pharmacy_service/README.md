# Pharmacy Service

Pharmacy Service for Hospital Management System - Manages medicine inventory, stock levels, and pharmacy operations.

## Features

- Add, update, and delete medicines
- Manage medicine stock levels
- Track medicine categories and prices
- Monitor expiry dates
- Get low-stock and out-of-stock alerts
- Filter medicines by category and status
- Search medicines by name or manufacturer
- Pharmacy statistics and analytics

## Installation

1. Navigate to the pharmacy_service directory:
```bash
cd pharmacy_service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and port

## Running the Service

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The service will run on the port specified in your `.env` file (default: 5004).

## API Endpoints

### Medicines
- `POST /api/medicines` - Create a new medicine
- `GET /api/medicines` - Get all medicines with optional filters
  - Query parameters: `category`, `status`, `search`, `sort`
- `GET /api/medicines/:id` - Get medicine by ID
- `PUT /api/medicines/:id` - Update medicine details
- `DELETE /api/medicines/:id` - Delete a medicine
- `PUT /api/medicines/:id/stock` - Update stock (add/subtract)

### Analytics & Filtering
- `GET /api/medicines/stats` - Get pharmacy statistics
- `GET /api/medicines/category/:category` - Get medicines by category
- `GET /api/medicines/low-stock` - Get low-stock medicines
- `GET /api/medicines/out-of-stock` - Get out-of-stock medicines

## Medicine Schema

```javascript
{
  medicineId: String (unique),
  name: String,
  category: String,
  description: String,
  manufacturer: String,
  stock: Number,
  unit: String (Tablets, Capsules, Liquid, Injection, Cream, Gel, Powder),
  price: Number,
  expiryDate: Date,
  batchNumber: String,
  status: String (In-Stock, Low-Stock, Out-of-Stock),
  reorderLevel: Number,
  sideEffects: String,
  dosage: String,
  usageInstructions: String,
  timestamps: true
}
```

## Docker

Build and run using Docker:
```bash
docker build -t pharmacy-service .
docker run -p 5004:5004 --env-file .env pharmacy-service
```

## Environment Variables

- `PORT` - Service port (default: 5004)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

## License

ISC
