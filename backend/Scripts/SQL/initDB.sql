DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Reservation CASCADE;
DROP TABLE IF EXISTS Post CASCADE ;
DROP TABLE IF EXISTS Address CASCADE ;
DROP TABLE IF EXISTS Client CASCADE ;
DROP TABLE IF EXISTS Category_product CASCADE ;
DROP TABLE IF EXISTS Post_category CASCADE ;

CREATE TABLE Address (
    id SERIAL PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    UNIQUE (city, postal_code)
);

CREATE TABLE Client (
    googleId VARCHAR(50) UNIQUE,
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    street VARCHAR(100),
    street_number INT,
    CHECK (street_number > 0),
    registration_date DATE DEFAULT NOW(),
    photo VARCHAR(255) NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    address_id INT REFERENCES Address(id) ON DELETE CASCADE
);


CREATE TABLE Post (
    id SERIAL PRIMARY KEY,
    post_date DATE DEFAULT NOW(),
    description VARCHAR(255) NOT NULL,
    title VARCHAR(50) NOT NULL,
    number_of_places INT NOT NULL,
    post_status VARCHAR(20) NOT NULL DEFAULT 'available',
    CHECK (number_of_places > 0),
    CHECK (post_status IN ('available', 'unavailable')),
    photo VARCHAR(255) NULL,
    street VARCHAR(100) NOT NULL,
    street_number INT NOT NULL,
    CHECK (street_number > 0),
    address_id INT NOT NULL REFERENCES Address(id) ON DELETE CASCADE, 
    client_id INT NOT NULL REFERENCES Client(id) ON DELETE CASCADE
);

CREATE TABLE Reservation (
    id SERIAL PRIMARY KEY,
    reservation_date DATE DEFAULT NOW(),
    reservation_status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    CHECK (reservation_status IN ('confirmed', 'cancelled','withdrawal')),
    post_id INT NOT NULL REFERENCES Post(id) ON DELETE CASCADE,
    client_id INT NOT NULL REFERENCES Client(id) ON DELETE CASCADE
);



CREATE TABLE Category_product
(
    id_category SERIAL PRIMARY KEY,
    name_category VARCHAR(20) UNIQUE
);

CREATE TABLE Post_category (
    id SERIAL PRIMARY KEY,
    id_category INT NOT NULL,
    id_ad INT NOT NULL,
    CONSTRAINT fk_category FOREIGN KEY (id_category) REFERENCES Category_product(id_category) ON DELETE CASCADE,
    CONSTRAINT fk_ad FOREIGN KEY (id_ad) REFERENCES Post(id) ON DELETE CASCADE
);

CREATE TABLE Comment (
    id SERIAL PRIMARY KEY,
    content VARCHAR(300),
    date DATE DEFAULT CURRENT_DATE,
    id_post INT NOT NULL,
    id_customer INT NOT NULL,
    CONSTRAINT fk_post FOREIGN KEY (id_post) REFERENCES Post(id) ON DELETE CASCADE,
    CONSTRAINT fk_customer FOREIGN KEY (id_customer) REFERENCES Client(id) ON DELETE CASCADE
);




