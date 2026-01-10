# School Management Backend

Backend server for the School Management Application using Node.js, Express, and SQL Server.

## Prerequisites

- Node.js (v14 or higher)
- SQL Server (LocalDB or SQL Server Express)
- SQL Server Management Studio (optional, for database management)

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Database

1. Make sure SQL Server is running
2. Open SQL Server Management Studio
3. Connect to `localhost\SQLEXPRESS`
4. Run the `schema.sql` script to create the Students table

### 3. Configure Environment Variables

The `config.env` file contains the database connection settings:

```env
PORT=5000
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=SchoolDB
DB_TRUST_SERVER_CERTIFICATE=true
DB_ENCRYPT=true
DB_INTEGRATED_SECURITY=true
```

Modify these values if your SQL Server configuration is different.

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Students

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a single student by ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics (total students, paid/unpaid counts)

### Health Check

- `GET /api/health` - Check if server is running

## Example API Requests

### Create a Student

```bash
POST http://localhost:5000/api/students
Content-Type: application/json

{
  "name": "John Doe",
  "grade": "10th Grade",
  "age": 16,
  "phone": "123-456-7890",
  "address": "123 Main St",
  "paymentStatus": "Paid"
}
```

### Get All Students

```bash
GET http://localhost:5000/api/students
```

### Update a Student

```bash
PUT http://localhost:5000/api/students/1
Content-Type: application/json

{
  "name": "John Doe Updated",
  "grade": "11th Grade",
  "age": 17,
  "phone": "123-456-7890",
  "address": "123 Main St",
  "paymentStatus": "Paid"
}
```

### Delete a Student

```bash
DELETE http://localhost:5000/api/students/1
```

## Troubleshooting

### Database Connection Issues

1. Verify SQL Server is running
2. Check the server name in `config.env` (should be `localhost\SQLEXPRESS` or your instance name)
3. Ensure Windows Authentication is enabled
4. Make sure the SchoolDB database exists

### Port Already in Use

If port 5000 is already in use, change the PORT value in `config.env`

## Project Structure

```
server/
├── config/
│   └── database.js       # Database connection configuration
├── routes/
│   ├── students.js       # Student CRUD endpoints
│   └── dashboard.js      # Dashboard statistics endpoint
├── config.env            # Environment variables
├── package.json          # Dependencies and scripts
├── schema.sql            # Database schema
├── server.js             # Main server file
└── README.md             # This file
```
