const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "angeliteforecast",
  password: "thesis",
  port: 5432,
});

const SECRET_KEY = "thesis"

app.get("/api/transactions", async (req, res) => {
  try {
    // Extract query parameters
    const {
      search,
      department,
      startYear,
      endYear,
      firstYear,
      secondYear,
      thirdYear,
      fourthYear,
      fifthYear,
    } = req.query;

    // Start with the base query
    let query = `
      SELECT * FROM enrollment
      WHERE "Department" NOT IN ('GS', 'JHS', 'HAUSPELL', 'HAU', 'MA')
    `;
    const conditions = [];
    const values = [];

    // Check if department parameter is present
    if (department) {
      conditions.push(`"Department" = $${conditions.length + 1}`);
      values.push(department);
    }

    // Check if search parameter is present
    if (search) {
      conditions.push(
        `("Major" ILIKE $${conditions.length + 1} OR "Semester" ILIKE $${
          conditions.length + 1
        })`
      );
      values.push(`%${search}%`);
    }

    // Check if startYear parameter is present
    if (startYear) {
      conditions.push(`"Start_Year" = $${conditions.length + 1}`);
      values.push(parseInt(startYear, 10));
    }

    // Check if endYear parameter is present
    if (endYear) {
      conditions.push(`"End_Year" = $${conditions.length + 1}`);
      values.push(parseInt(endYear, 10));
    }

    // Check if firstYear parameter is present
    if (firstYear) {
      conditions.push(`"1st_Year" = $${conditions.length + 1}`);
      values.push(parseInt(firstYear, 10));
    }

    // Check if secondYear parameter is present
    if (secondYear) {
      conditions.push(`"2nd_Year" = $${conditions.length + 1}`);
      values.push(parseInt(secondYear, 10));
    }

    // Check if thirdYear parameter is present
    if (thirdYear) {
      conditions.push(`"3rd_Year" = $${conditions.length + 1}`);
      values.push(parseInt(thirdYear, 10));
    }

    // Check if fourthYear parameter is present
    if (fourthYear) {
      conditions.push(`"4th_Year" = $${conditions.length + 1}`);
      values.push(parseInt(fourthYear, 10));
    }

    // Check if fifthYear parameter is present
    if (fifthYear) {
      conditions.push(`"5th_Year" = $${conditions.length + 1}`);
      values.push(parseInt(fifthYear, 10));
    }

    // Append conditions to the query if any
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Log the query for debugging
    console.log("Executing query:", query);
    console.log("With values:", values);

    // Execute the query with the conditions
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/departments", async (req, res) => {
  try {
    const query = 'SELECT DISTINCT "Department" FROM enrollment  WHERE "Department" != \'SHS\'';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Endpoint to fetch majors based on department
app.get("/api/majors", async (req, res) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ error: "Department is required" });
    }

    const query = `
      WITH max_year AS (
        SELECT MAX("Start_Year") as max_start_year
        FROM enrollment
        WHERE "Department" = $1
      )
      SELECT 
        DISTINCT e."Major",
        my.max_start_year,
        COALESCE(
          (SELECT MAX("Semester") 
           FROM enrollment 
           WHERE "Department" = $1 AND "Start_Year" = my.max_start_year),
          1
        ) as max_semester
      FROM enrollment e
      CROSS JOIN max_year my
      WHERE e."Department" = $1
        AND e."Start_Year" = my.max_start_year
      ORDER BY e."Major"
    `;
    
    const values = [department];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Registration endpoint
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password, confirmPassword } = req.body;
  try {
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return res.status(400).json({ error: "Passwords do not match" });
    }
    console.log("zzzz")

    // Check if username already exists
    const usernameCheck = await pool.query("SELECT * FROM users WHERE username = $1", [name]);
    console.log("aaaa", usernameCheck.rows.length)
    if (usernameCheck.rows.length > 0) {
      console.log("Username already exists");
      return res.status(400).json({ error: "Username already exists" });
    }

    // Check if email already exists
    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      console.log("Email already exists");
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hashedPassword]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
