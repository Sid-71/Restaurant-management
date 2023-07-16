# API Documentation

This documentation describes the API endpoints, request/response formats, and authentication requirements for the application.

## Register User

Registers a new user.

- **Endpoint:** POST /register
- **Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```
## Response:
201 Created: User registered successfully
500 Internal Server Error: An error occurred




#### User Login

Logs in a user and returns a JWT token.

- **Endpoint:** POST /login
- **Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

## Response:
200 OK: User logged in successfully, returns a JWT token
401 Unauthorized: Invalid username or password or missing credentials
500 Internal Server Error: An error occurred




 ## Availability API

### Get Availability
Retrieves the availability for a specific date.

**Endpoint**: `GET /availability`

**Response**:
- `200 OK`: Returns an array of availability objects.
- `500 Internal Server Error`: An error occurred.

### Create Availability
Creates availability for a specific date with the provided capacity.

**Endpoint**: `POST /availability`

**Request Body**:
```json
{
  "date": "string",
  "capacity": "string"
}
```



# Authentication

Requires a valid JWT token in the Authorization header.

## Responses

* `201 Created`: Availability created successfully
* `409 Conflict`: Availability already exists for the date
* `500 Internal Server Error`: An error occurred

## Get Available Tables

Endpoint: `GET /tables`

**Query Parameters:**

* `date`: The date for which to retrieve available tables
* `capacity`: The minimum capacity required

**Responses:**

* `200 OK`: Returns an array of available table objects
* `500 Internal Server Error`: An error occurred

## Create Booking

Endpoint: `POST /bookings`


**Request Body**:
```json
{
  "date": "string",
  "capacity": "string"
}
```

## Authentication: Requires a valid JWT token in the Authorization header

## Response:

* `201 Created`: Booking created successfully
* `404 Not Found`: Table not available for the selected date
* `500 Internal Server Error`: An error occurred

## Authentication

* Registering a user does not require authentication.
* Logging in generates a JWT token that needs to be passed in the Authorization header for authenticated endpoints.

## Database Schema Design

Table: `users`

Columns:

* `todo_id` (serial primary key)
* `username` (varchar(255))
* `password` (varchar(255))

Table: `availability`

Columns:

* `availability_id` (serial primary key)
* `date` (varchar(255))
* `capacity` (varchar(255))

Table: `bookings`

Columns:

* `booking_id` (serial primary key)
* `date` (varchar(255))
* `tableId` (varchar(255))

## SQL Scripts for Table Creation and Sample Data Insertion

sql
CREATE DATABASE todo_database;

CREATE TABLE users (
  todo_id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE availability (
  availability_id SERIAL PRIMARY KEY,
  date VARCHAR(255),
  capacity VARCHAR(255)
);

CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  date VARCHAR(255),
  tableId VARCHAR(255)
);

INSERT INTO users (username, password) VALUES
  ('johndoe', 'password'),
  ('janedoe', 'password');

INSERT INTO availability (date, capacity) VALUES
  ('2023-07-16', '2'),
  ('2023-07-17', '4');

INSERT INTO bookings (date, tableId) VALUES
  ('2023-07-16', '1'),
  ('2023-07-17', '2');