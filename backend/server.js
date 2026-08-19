require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());


app.use(express.json());

const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Vermi Business Management System API is running!');
});

app.get('/api/customers', (req, res) => {
    const sql = 'SELECT * FROM customers';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch customers'
            });
            return;
        }

        res.json(results);
    });
});
app.get('/api/customers/:id', (req, res) => {
    const customerId = req.params.id;

    const sql = 'SELECT * FROM customers WHERE customer_id = ?';

    db.query(sql, [customerId], (err, results) => {
        if (err) {
            console.error('Database query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch customer'
            });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({
                error: 'Customer not found'
            });
            return;
        }

        res.json(results[0]);
    });
});
app.post('/api/customers', (req, res) => {
    const { name, phone, address, location } = req.body;

    const sql = `
        INSERT INTO customers (name, phone, address, location)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, phone, address, location],
        (err, result) => {
            if (err) {
                console.error('Database insert failed:', err.message);
                res.status(500).json({
                    error: 'Failed to add customer'
                });
                return;
            }

            res.status(201).json({
                message: 'Customer added successfully',
                customer_id: result.insertId
            });
        }
    );
});
app.put('/api/customers/:id', (req, res) => {
    const customerId = req.params.id;
    const { name, phone, address, location } = req.body;

    const sql = `
        UPDATE customers
        SET name = ?, phone = ?, address = ?, location = ?
        WHERE customer_id = ?
    `;

    db.query(
        sql,
        [name, phone, address, location, customerId],
        (err, result) => {
            if (err) {
                console.error('Database update failed:', err.message);
                res.status(500).json({
                    error: 'Failed to update customer'
                });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({
                    error: 'Customer not found'
                });
                return;
            }

            res.json({
                message: 'Customer updated successfully'
            });
        }
    );
});
app.delete('/api/customers/:id', (req, res) => {
    const customerId = req.params.id;

    // First find the customer's orders
    const findOrdersSql = `
        SELECT order_id
        FROM orders
        WHERE customer_id = ?
    `;

    db.query(findOrdersSql, [customerId], (err, orders) => {

        if (err) {
            console.error('Failed to find customer orders:', err.message);
            return res.status(500).json({
                error: 'Failed to find customer orders'
            });
        }

        // If customer has no orders, directly delete customer
        if (orders.length === 0) {

            const deleteCustomerSql = `
                DELETE FROM customers
                WHERE customer_id = ?
            `;

            db.query(
                deleteCustomerSql,
                [customerId],
                (err, result) => {

                    if (err) {
                        console.error(
                            'Customer delete failed:',
                            err.message
                        );

                        return res.status(500).json({
                            error: 'Failed to delete customer'
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            error: 'Customer not found'
                        });
                    }

                    res.json({
                        message: 'Customer deleted successfully'
                    });
                }
            );

            return;
        }

        // Get order IDs
        const orderIds = orders.map(order => order.order_id);

        // Delete deliveries
        const deleteDeliveriesSql = `
            DELETE FROM deliveries
            WHERE order_id IN (?)
        `;

        db.query(
            deleteDeliveriesSql,
            [orderIds],
            (err) => {

                if (err) {
                    console.error(
                        'Failed to delete deliveries:',
                        err.message
                    );

                    return res.status(500).json({
                        error: 'Failed to delete customer deliveries'
                    });
                }

                // Delete order items
                const deleteItemsSql = `
                    DELETE FROM order_items
                    WHERE order_id IN (?)
                `;

                db.query(
                    deleteItemsSql,
                    [orderIds],
                    (err) => {

                        if (err) {
                            console.error(
                                'Failed to delete order items:',
                                err.message
                            );

                            return res.status(500).json({
                                error: 'Failed to delete order items'
                            });
                        }

                        // Delete orders
                        const deleteOrdersSql = `
                            DELETE FROM orders
                            WHERE customer_id = ?
                        `;

                        db.query(
                            deleteOrdersSql,
                            [customerId],
                            (err) => {

                                if (err) {
                                    console.error(
                                        'Failed to delete orders:',
                                        err.message
                                    );

                                    return res.status(500).json({
                                        error: 'Failed to delete customer orders'
                                    });
                                }

                                // Finally delete customer
                                const deleteCustomerSql = `
                                    DELETE FROM customers
                                    WHERE customer_id = ?
                                `;

                                db.query(
                                    deleteCustomerSql,
                                    [customerId],
                                    (err, result) => {

                                        if (err) {
                                            console.error(
                                                'Customer delete failed:',
                                                err.message
                                            );

                                            return res.status(500).json({
                                                error: 'Failed to delete customer'
                                            });
                                        }

                                        if (result.affectedRows === 0) {
                                            return res.status(404).json({
                                                error: 'Customer not found'
                                            });
                                        }

                                        res.json({
                                            message:
                                                'Customer and related records deleted successfully'
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    });
});
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch products'
            });
            return;
        }

        res.json(results);
    });
});
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    const sql = 'SELECT * FROM products WHERE product_id = ?';

    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Database query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch product'
            });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({
                error: 'Product not found'
            });
            return;
        }

        res.json(results[0]);
    });
});
app.post('/api/products', (req, res) => {
    const {
        product_name,
        category,
        price,
        unit,
        stock_quantity,
        low_stock_limit
    } = req.body;

    const sql = `
        INSERT INTO products
        (product_name, category, price, unit, stock_quantity, low_stock_limit)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            product_name,
            category,
            price,
            unit,
            stock_quantity,
            low_stock_limit
        ],
        (err, result) => {
            if (err) {
                console.error('Database insert failed:', err.message);
                res.status(500).json({
                    error: 'Failed to add product'
                });
                return;
            }

            res.status(201).json({
                message: 'Product added successfully',
                product_id: result.insertId
            });
        }
    );
});
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    const {
        product_name,
        category,
        price,
        unit,
        stock_quantity,
        low_stock_limit,
        status
    } = req.body;

    const sql = `
        UPDATE products
        SET
            product_name = ?,
            category = ?,
            price = ?,
            unit = ?,
            stock_quantity = ?,
            low_stock_limit = ?,
            status = ?
        WHERE product_id = ?
    `;

    db.query(
        sql,
        [
            product_name,
            category,
            price,
            unit,
            stock_quantity,
            low_stock_limit,
            status,
            productId
        ],
        (err, result) => {
            if (err) {
                console.error('Database update failed:', err.message);
                res.status(500).json({
                    error: 'Failed to update product'
                });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({
                    error: 'Product not found'
                });
                return;
            }

            res.json({
                message: 'Product updated successfully'
            });
        }
    );
});
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    // First delete inventory transactions for this product
    const deleteInventorySql = `
        DELETE FROM inventory_transactions
        WHERE product_id = ?
    `;

    db.query(deleteInventorySql, [productId], (err) => {

        if (err) {
            console.error(
                'Failed to delete inventory transactions:',
                err.message
            );

            return res.status(500).json({
                error: 'Failed to delete product inventory records'
            });
        }

        // Delete order items that reference this product
        const deleteOrderItemsSql = `
            DELETE FROM order_items
            WHERE product_id = ?
        `;

        db.query(deleteOrderItemsSql, [productId], (err) => {

            if (err) {
                console.error(
                    'Failed to delete order items:',
                    err.message
                );

                return res.status(500).json({
                    error: 'Failed to delete product order records'
                });
            }

            // Finally delete the product
            const deleteProductSql = `
                DELETE FROM products
                WHERE product_id = ?
            `;

            db.query(
                deleteProductSql,
                [productId],
                (err, result) => {

                    if (err) {
                        console.error(
                            'Database delete failed:',
                            err.message
                        );

                        return res.status(500).json({
                            error: 'Failed to delete product'
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            error: 'Product not found'
                        });
                    }

                    res.json({
                        message: 'Product deleted successfully'
                    });
                }
            );
        });
    });
});
app.get('/api/orders', (req, res) => {
    const sql = 'SELECT * FROM orders';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch orders'
            });
            return;
        }

        res.json(results);
    });
});
app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;

    const orderSql = `
        SELECT
            o.order_id,
            o.customer_id,
            c.name AS customer_name,
            c.phone AS customer_phone,
            c.address AS customer_address,
            c.location AS customer_location,
            o.order_date,
            o.status,
            o.total_amount
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.customer_id
        WHERE o.order_id = ?
    `;

    db.query(orderSql, [orderId], (err, orderResults) => {

        if (err) {
            console.error('Order query failed:', err.message);

            res.status(500).json({
                error: 'Failed to fetch order'
            });

            return;
        }

        if (orderResults.length === 0) {
            res.status(404).json({
                error: 'Order not found'
            });

            return;
        }

        const itemSql = `
            SELECT
                oi.order_item_id,
                oi.product_id,
                p.product_name,
                p.unit,
                oi.quantity,
                oi.unit_price,
                (oi.quantity * oi.unit_price) AS item_total
            FROM order_items oi
            JOIN products p
                ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
        `;

        db.query(itemSql, [orderId], (err, itemResults) => {

            if (err) {
                console.error('Order items query failed:', err.message);

                res.status(500).json({
                    error: 'Failed to fetch order items'
                });

                return;
            }

            res.json({
                order: orderResults[0],
                items: itemResults
            });
        });
    });
});
app.get('/api/orders/:id/details', (req, res) => {
    const orderId = req.params.id;

    const sql = `
        SELECT
            o.order_id,
            o.order_date,
            o.status,
            o.total_amount,
            c.customer_id,
            c.name AS customer_name,
            c.phone,
            c.address,
            c.location,
            p.product_id,
            p.product_name,
            p.unit,
            oi.quantity,
            oi.unit_price,
            (oi.quantity * oi.unit_price) AS item_total
        FROM orders o
        JOIN customers c
            ON o.customer_id = c.customer_id
        JOIN order_items oi
            ON o.order_id = oi.order_id
        JOIN products p
            ON oi.product_id = p.product_id
        WHERE o.order_id = ?
    `;

    db.query(sql, [orderId], (err, results) => {
        if (err) {
            console.error('Database query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch order details'
            });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({
                error: 'Order not found'
            });
            return;
        }

        res.json(results);
    });
});
app.post('/api/orders', (req, res) => {
    const { customer_id, order_date, items } = req.body;

    if (!customer_id || !order_date || !items || items.length === 0) {
        res.status(400).json({
            error: 'Customer, order date, and at least one item are required'
        });
        return;
    }

    const orderSql = `
        INSERT INTO orders
        (customer_id, order_date, status, total_amount)
        VALUES (?, ?, 'Pending', 0)
    `;

    db.query(
        orderSql,
        [customer_id, order_date],
        (err, orderResult) => {
            if (err) {
                console.error('Order creation failed:', err.message);
                res.status(500).json({
                    error: 'Failed to create order'
                });
                return;
            }

            const orderId = orderResult.insertId;

            const itemSql = `
                INSERT INTO order_items
                (order_id, product_id, quantity, unit_price)
                VALUES ?
            `;

            const itemValues = items.map(item => [
                orderId,
                item.product_id,
                item.quantity,
                item.unit_price
            ]);

            db.query(
                itemSql,
                [itemValues],
                (err) => {
                    if (err) {
                        console.error('Order items creation failed:', err.message);
                        res.status(500).json({
                            error: 'Order created but order items failed'
                        });
                        return;
                    }

                    const totalAmount = items.reduce(
                        (total, item) =>
                            total + (item.quantity * item.unit_price),
                        0
                    );

                    const updateSql = `
                        UPDATE orders
                        SET total_amount = ?
                        WHERE order_id = ?
                    `;

                    db.query(
                        updateSql,
                        [totalAmount, orderId],
                        (err) => {
                            if (err) {
                                console.error('Order total update failed:', err.message);
                                res.status(500).json({
                                    error: 'Order created but total update failed'
                                });
                                return;
                            }

                            res.status(201).json({
                                message: 'Order created successfully',
                                order_id: orderId,
                                total_amount: totalAmount
                            });
                        }
                    );
                }
            );
        }
    );
});
app.put('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
        'Pending',
        'Confirmed',
        'Delivered',
        'Cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
        res.status(400).json({
            error: 'Invalid order status'
        });
        return;
    }

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE order_id = ?
    `;

    db.query(
        sql,
        [status, orderId],
        (err, result) => {
            if (err) {
                console.error('Order update failed:', err.message);
                res.status(500).json({
                    error: 'Failed to update order'
                });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({
                    error: 'Order not found'
                });
                return;
            }

            res.json({
                message: 'Order status updated successfully'
            });
        }
    );
});
app.get('/api/orders/:id', (req, res) => {

    // your existing order details code

});   // ← END of GET /api/orders/:id


// ADD THE NEW CODE HERE

app.put('/api/orders/:id/status', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
        'Pending',
        'Confirmed',
        'Delivered',
        'Cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            error: 'Invalid order status'
        });
    }

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE order_id = ?
    `;

    db.query(sql, [status, orderId], (err, result) => {
        if (err) {
            console.error('Status update failed:', err.message);

            return res.status(500).json({
                error: 'Failed to update order status'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Order not found'
            });
        }

        res.json({
            message: 'Order status updated successfully',
            status: status
        });
    });
});
app.get('/api/deliveries', (req, res) => {
    const sql = 'SELECT * FROM deliveries';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch deliveries'
            });
            return;
        }

        res.json(results);
    });
});
app.get('/api/deliveries/:id', (req, res) => {
    const deliveryId = req.params.id;

    const sql = 'SELECT * FROM deliveries WHERE delivery_id = ?';

    db.query(sql, [deliveryId], (err, results) => {
        if (err) {
            console.error('Database query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch delivery'
            });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({
                error: 'Delivery not found'
            });
            return;
        }

        res.json(results[0]);
    });
});
app.post('/api/deliveries', (req, res) => {
    const { order_id, delivery_date, status, notes } = req.body;

    const sql = `
        INSERT INTO deliveries
        (order_id, delivery_date, status, notes)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [order_id, delivery_date, status || 'Pending', notes],
        (err, result) => {
            if (err) {
                console.error('Delivery creation failed:', err.message);
                res.status(500).json({
                    error: 'Failed to create delivery'
                });
                return;
            }

            res.status(201).json({
                message: 'Delivery created successfully',
                delivery_id: result.insertId
            });
        }
    );
});
app.put('/api/deliveries/:id', (req, res) => {
    const deliveryId = req.params.id;
    const { delivery_date, status, notes } = req.body;

    const allowedStatuses = [
        'Pending',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
        res.status(400).json({
            error: 'Invalid delivery status'
        });
        return;
    }

    const sql = `
        UPDATE deliveries
        SET delivery_date = ?, status = ?, notes = ?
        WHERE delivery_id = ?
    `;

    db.query(
        sql,
        [delivery_date, status, notes, deliveryId],
        (err, result) => {
            if (err) {
                console.error('Delivery update failed:', err.message);
                res.status(500).json({
                    error: 'Failed to update delivery'
                });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({
                    error: 'Delivery not found'
                });
                return;
            }

            res.json({
                message: 'Delivery updated successfully'
            });
        }
    );
});
app.get('/api/inventory', (req, res) => {
    const sql = 'SELECT * FROM inventory_transactions';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch inventory transactions'
            });
            return;
        }

        res.json(results);
    });
});
app.post('/api/inventory', (req, res) => {
    const {
        product_id,
        transaction_type,
        quantity,
        notes
    } = req.body;

    const allowedTypes = [
        'Stock In',
        'Sale',
        'Adjustment'
    ];

    if (!product_id || !transaction_type || !quantity) {
        res.status(400).json({
            error: 'Product, transaction type, and quantity are required'
        });
        return;
    }

    if (!allowedTypes.includes(transaction_type)) {
        res.status(400).json({
            error: 'Invalid transaction type'
        });
        return;
    }

    const sql = `
        INSERT INTO inventory_transactions
        (product_id, transaction_type, quantity, notes)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [product_id, transaction_type, quantity, notes],
        (err, result) => {
            if (err) {
                console.error('Inventory transaction failed:', err.message);
                res.status(500).json({
                    error: 'Failed to create inventory transaction'
                });
                return;
            }

            res.status(201).json({
                message: 'Inventory transaction created successfully',
                transaction_id: result.insertId
            });
        }
    );
});
app.get('/api/inventory/stock', (req, res) => {
    const sql = `
        SELECT
            p.product_id,
            p.product_name,
            p.unit,
            COALESCE(
                SUM(
                    CASE
                        WHEN it.transaction_type = 'Stock In'
                            THEN it.quantity

                        WHEN it.transaction_type = 'Sale'
                            THEN -it.quantity

                        WHEN it.transaction_type = 'Adjustment'
                            THEN it.quantity
                    END
                ),
                0
            ) AS current_stock
        FROM products p
        LEFT JOIN inventory_transactions it
            ON p.product_id = it.product_id
        GROUP BY
            p.product_id,
            p.product_name,
            p.unit
        ORDER BY p.product_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Stock calculation failed:', err.message);
            res.status(500).json({
                error: 'Failed to calculate stock'
            });
            return;
        }

        res.json(results);
    });
});
app.get('/api/analytics/summary', (req, res) => {
    const sql = `
    SELECT
        (SELECT COUNT(*) FROM customers) AS total_customers,

        (SELECT COUNT(*) FROM products) AS total_products,

        (SELECT COUNT(*) FROM orders) AS total_orders,

        (SELECT COALESCE(SUM(total_amount), 0)
         FROM orders
         WHERE status != 'Cancelled') AS total_revenue;

    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Analytics query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch analytics summary'
            });
            return;
        }

        res.json(results[0]);
    });
});
app.get('/api/analytics/product-sales', (req, res) => {
    const sql = `
        SELECT
            p.product_id,
            p.product_name,
            p.unit,
            SUM(oi.quantity) AS quantity_sold,
            SUM(oi.quantity * oi.unit_price) AS total_revenue
        FROM order_items oi
        JOIN products p
            ON oi.product_id = p.product_id
        JOIN orders o
            ON oi.order_id = o.order_id
        WHERE o.status != 'Cancelled'
        GROUP BY
            p.product_id,
            p.product_name,
            p.unit
        ORDER BY quantity_sold DESC;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Product sales query failed:', err.message);
            res.status(500).json({
                error: 'Failed to fetch product sales'
            });
            return;
        }

        res.json(results);
    });
});
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: 'Username and password are required'
        });
    }

    const sql = `
        SELECT id, username
        FROM users
        WHERE username = ? AND password = ?
    `;

    db.query(
        sql,
        [username, password],
        (err, results) => {

            if (err) {
                console.error('Login query failed:', err.message);

                return res.status(500).json({
                    error: 'Login failed'
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    error: 'Invalid username or password'
                });
            }

            res.json({
                message: 'Login successful',
                user: results[0]
            });
        }
    );
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});