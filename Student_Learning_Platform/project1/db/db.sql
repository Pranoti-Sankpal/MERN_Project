Create Database:

CREATE DATABASE learning_platform;
USE learning_platform;

CREATE TABLE users (
    email VARCHAR(100) PRIMARY KEY,
    password VARCHAR(255) default 'sunbeam',
    role ENUM('admin', 'student') default 'student'
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    fees INT,
    start_date DATE,
    end_date DATE,
    video_expire_days INT
);


CREATE TABLE students (
    reg_no INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    course_id INT,
    mobile_no BIGINT,
    profile_pic BLOB,
    CONSTRAINT fk_email FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_course_id FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE videos (
    video_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT,
    title VARCHAR(150),
    description VARCHAR(255),
    youtube_url VARCHAR(255),
    added_at datetime default current_timestamp,
    CONSTRAINT fkk_course_id FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- UPDATE users
-- //SET password = SHA2('sunbeam', 256);



