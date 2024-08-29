CREATE TABLE customer_measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    image LONGBLOB NOT NULL
);