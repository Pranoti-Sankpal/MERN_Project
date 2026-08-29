CREATE DATABASE car_rental;

USE car_rental;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('user', 'owner') DEFAULT 'user',

    PRIMARY KEY (id)
);

CREATE TABLE cars (
    id INT NOT NULL AUTO_INCREMENT,
    owner_id INT,
    brand VARCHAR(100),
    model VARCHAR(100),
    year INT,
    price_per_day INT,
    category VARCHAR(50),
    transmission VARCHAR(50),
    fuel_type VARCHAR(50),
    seating_capacity INT,
    location VARCHAR(100),
    description TEXT,
    image VARCHAR(255),

    PRIMARY KEY (id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE bookings (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    car_id INT,
    pickup_date DATE,
    return_date DATE,
    total_price INT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
);