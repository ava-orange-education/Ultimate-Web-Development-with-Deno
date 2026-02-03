import mysql from "mysql2/promise";

// Configuration
const config = {
  host: "localhost",
  user: "user",
  password: "password",
  database: "app_db",
  port: 3306
};

try {
    const connection = await mysql.createConnection(config);
    console.log("Connected to MySQL!");

    // Create table
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL
        )
    `);

    // Insert
    await connection.execute(
        "INSERT INTO products (name, price) VALUES (?, ?)",
        ["Deno Sticker", 5.99]
    );

    // Query
    const [rows, _fields] = await connection.execute(
        "SELECT * FROM products WHERE price > ?",
        [1.00]
    );

    console.log("Products in MySQL:", rows);

    await connection.end();

} catch (error) {
    console.error("MySQL Error. Make sure Docker is running.", error);
}
