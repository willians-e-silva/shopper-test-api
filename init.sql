CREATE TABLE customer_measurement (
    id                  INT AUTO_INCREMENT      PRIMARY KEY,
    customer_code       VARCHAR(255)            NOT NULL,
    measure_type        VARCHAR(255)            NOT NULL,
    measure_datetime    DATE                    NOT NULL,
    measure_uuid        VARCHAR(36)             NOT NULL,
    has_confirmed       BOOLEAN                 DEFAULT FALSE,
    image_url           VARCHAR(255)            NOT NULL
);