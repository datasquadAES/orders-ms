-- Tabla orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    dealer_id INT NOT NULL,
    address VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla order_items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Tabla order_status_history
CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_status FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Datos de prueba para orders
INSERT INTO orders (user_id, store_id, dealer_id, address, status, total_amount) VALUES
(1, 101, 201, 'carrera 95 #23-78', 'pendiente', 150.00),
(2, 102, 202, 'carrera 91 #167-8','pagado', 200.50),
(3, 103, 201, 'carrera 93 #12-44','en camino', 300.75);

-- Datos de prueba para order_items
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 201, 2, 50.00),
(1, 202, 1, 50.00),
(2, 203, 3, 66.83),
(3, 204, 1, 300.75);

-- Datos de prueba para order_status_history
INSERT INTO order_status_history (order_id, status) VALUES
(1, 'pendiente'),
(2, 'pendiente'),
(2, 'pagado'),
(3, 'pendiente'),
(3, 'en camino');