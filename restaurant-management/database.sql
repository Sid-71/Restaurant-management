CREATE DATABASE todo_database;



CREATE TABLE users(
    todo_id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255)
)

CREATE TABLE availability(
    availability_id SERIAL PRIMARY KEY,
    date VARCHAR(255),
    capacity VARCHAR(255)
)

CREATE TABLE bookings(
    booking_id SERIAL PRIMARY KEY,
    date VARCHAR(255),
    tableId VARCHAR(255)
)