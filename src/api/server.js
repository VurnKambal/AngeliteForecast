const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, query, validationResult } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to validate request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

app.get("/api/transactions", 
  [
    query('department').optional().isString().trim().escape(),
    query('search').optional().isString().trim().escape(),
    query('startYear').optional().isInt(),
    query('endYear').optional().isInt(),
    query('firstYear').optional().isInt(),
    query('secondYear').optional().isInt(),
    query('thirdYear').optional().isInt(),
    query('fourthYear').optional().isInt(),
    query('fifthYear').optional().isInt(),
  ],
  validate,
  async (req, res) => {
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
    const query = {
      text: 'SELECT DISTINCT "Department" FROM processed_data ORDER BY "Department"'
    };
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to fetch majors based on department
app.get("/api/majors", 
  [query('department').isString().trim().escape()],
  validate,
  async (req, res) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ error: "Department is required" });
    }

    const query = {
      text: `
        WITH latest_data AS (
          SELECT 
            "Major",
            MAX("Start_Year") AS max_year
          FROM enrollment
          WHERE "Department" = $1
          GROUP BY "Major"
        ),
        latest_semester AS (
          SELECT 
            e."Major",
            e."Start_Year",
            MAX(e."Semester") AS max_semester
          FROM enrollment e
          JOIN latest_data ld ON e."Major" = ld."Major" AND e."Start_Year" = ld.max_year
          WHERE e."Department" = $1
          GROUP BY e."Major", e."Start_Year"
        )
        SELECT 
          m.name AS major,
          COALESCE(ld.max_year, m.latest_year) AS max_start_year,
          COALESCE(ls.max_semester, 1) AS max_semester
        FROM majors m
        LEFT JOIN latest_data ld ON m.name = ld."Major"
        LEFT JOIN latest_semester ls ON m.name = ls."Major"
        WHERE m.department = $1
        ORDER BY m.name
      `,
      values: [department]
    };
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Registration endpoint
app.post("/api/register", 
  [
    body('name').isString().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ],
  validate,
  async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if username already exists
    const usernameQuery = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [name]
    };
    const usernameCheck = await pool.query(usernameQuery);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Check if email already exists
    const emailQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email]
    };
    const emailCheck = await pool.query(emailQuery);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = {
      text: "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      values: [name, email, hashedPassword]
    };
    const result = await pool.query(insertQuery);
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login endpoint
app.post("/api/login", 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email]
    };
    const result = await pool.query(emailQuery);
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

// New route to get the latest data year
app.get('/api/latest-data-year', async (req, res) => {
  try {
    const latestYearQuery = {
      text: `
        SELECT MAX(GREATEST(
          enrollment."Start_Year",
          COALESCE(cpi_education."Year", 0),
          COALESCE(hfce."Start_Year", 0),
          COALESCE(admission."Start_Year", 0),
          COALESCE(inflation_rate."Start_Year", 0)
        )) as latest_year
        FROM enrollment
        LEFT JOIN cpi_education ON enrollment."Start_Year" = cpi_education."Year"
        LEFT JOIN hfce ON enrollment."Start_Year" = hfce."Start_Year"
        LEFT JOIN admission ON enrollment."Start_Year" = admission."Start_Year"
        LEFT JOIN inflation_rate ON enrollment."Start_Year" = inflation_rate."Start_Year"
      `
    };
    
    const result = await pool.query(latestYearQuery);
    
    if (result.rows.length > 0) {
      res.json({ latestYear: result.rows[0].latest_year });
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
