CREATE DATABASE IF NOT EXISTS logindemo;
USE logindemo;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Testikäyttäjä:
-- username: admin
-- password: password123
INSERT INTO users (username, password)
VALUES (
  'admin',
  '$2b$10$44pp0hgO.HC/fkl754E7Me5L21j0QhpeeuHa/K9/q52/CN6AKwJOe'
);
