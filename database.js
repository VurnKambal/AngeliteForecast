const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Database connection details
const pool = new Pool({
  user: 'postgres',
  host: '34.126.160.94',
  database: 'angeliteforecast',
  password: 'thesis',
  port: 5432,
});

// Admin user details
const username = "Admin";
const email = "admin@hau.edu.ph";
const password = "@ngeliteF0reca$t4dmin";  // Replace with the actual password you want to use

async function addOrUpdateAdmin() {
  const client = await pool.connect();

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if the user already exists
    const existingUserQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    const existingUserResult = await client.query(existingUserQuery, [username, email]);
    const existingUser = existingUserResult.rows[0];

    if (existingUser) {
      // Update the existing user
      const updateUserQuery = `
        UPDATE users 
        SET username = $1, email = $2, password_hash = $3
        WHERE id = $4
      `;
      await client.query(updateUserQuery, [username, email, hashedPassword, existingUser.id]);
      console.log("Admin user updated successfully.");
    } else {
      // Insert the new admin user
      const insertUserQuery = `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      const insertResult = await client.query(insertUserQuery, [username, email, hashedPassword]);
      const userId = insertResult.rows[0].id;

      // Insert the admin role for this user
      const insertRoleQuery = `
        INSERT INTO user_roles (user_id, role_id)
        VALUES ($1, (SELECT id FROM roles WHERE name = 'Admin'))
      `;
      await client.query(insertRoleQuery, [userId]);

      console.log("Admin user added successfully.");
    }

    await client.query('COMMIT');

  } catch (e) {
    await client.query('ROLLBACK');
    console.error("An error occurred:", e);
  } finally {
    client.release();
  }
}

addOrUpdateAdmin().then(() => {
  console.log("Operation completed.");
  pool.end();  // Close the connection pool
}).catch(err => {
  console.error("Unhandled error:", err);
  pool.end();  // Make sure to close the pool even if there's an unhandled error
});
