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
  }
);

app.get("/api/leads", 
  [
    query('department').optional().isString().trim().escape(),
    query('search').optional().isString().trim().escape()
  ],
  validate,
  async (req, res) => {
    const { department, search } = req.query;

    try {
      let query = `
        WITH admission_data AS (
          SELECT
            a."Start_Year",
            a."Department",
            COALESCE(a."Number_of_Applicants", 0) AS "Number_of_Applicants",
            COALESCE(a."Number_of_Enrolled_Applicants", 0) AS "Number_of_Enrolled_Applicants"
          FROM admission a
          WHERE 1=1
          ${department ? 'AND a."Department" = $1' : ''}
          ${search ? 'AND a."Department" ILIKE $2' : ''}
        ),
        external_data AS (
          SELECT
            c."Year" AS "Start_Year",
            ROUND(AVG(c."CPI_Region3")::numeric, 2) AS "CPI_Region3",
            ROUND(AVG(hfce."HFCE")::numeric, 2) AS "HFCE",
            ROUND(AVG(hfce."HFCE_Education")::numeric, 2) AS "HFCE_Education",
            ROUND(AVG(i."Inflation_Rate")::numeric, 2) AS "Inflation_Rate"
          FROM cpi_education c
          LEFT JOIN hfce ON c."Year" = hfce."Start_Year"
          LEFT JOIN inflation_rate i ON c."Year" = i."Start_Year"
          GROUP BY c."Year"
        )
        SELECT DISTINCT
          ad."Start_Year",
          ad."Department",
          ad."Number_of_Applicants",
          ad."Number_of_Enrolled_Applicants",
          COALESCE(ed."CPI_Region3", 0) AS "CPI_Region3",
          COALESCE(ed."HFCE", 0) AS "HFCE",
          COALESCE(ed."HFCE_Education", 0) AS "HFCE_Education",
          COALESCE(ed."Inflation_Rate", 0) AS "Inflation_Rate"
        FROM admission_data ad
        LEFT JOIN external_data ed ON ad."Start_Year" = ed."Start_Year"
        ORDER BY ad."Start_Year" ASC, ad."Department" ASC
      `;

      console.log(`Constructed Query: ${query}`);

      const values = [];
      if (department) values.push(department);
      if (search) values.push(`%${search}%`);

      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (err) {
      console.error("Error executing query", err.stack);
      res.status(500).send("Server error");
    }
  }
);

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

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });
    res.json({ token });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
  }
);

// New route to get the latest data year
app.get('/api/latest-data-year', async (req, res) => {
  try {
    const latestYearQuery = {
      text: `
        SELECT MAX("Start_Year") as latest_year
        FROM processed_data
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

// Endpoint to fetch external data based on school year and department
app.get("/api/external-data", 
  [
    query('schoolYear').isInt(),
    query('department').isString().trim().escape()
  ],
  validate,
  async (req, res) => {
    const { schoolYear, department } = req.query;

    try {
      const year = parseInt(schoolYear);

      const query = {
        text: `
          SELECT 
            "CPI_Region3" as "CPIEducation",
            "Inflation_Rate_lag_1" as "InflationRatePast",
            "Number_of_Applicants" as "AdmissionRate",
            "HFCE" as "OverallHFCE",
            "HFCE_Education" as "HFCEEducation"
          FROM processed_data
          WHERE "Start_Year" = $1 AND "Department" = $2
          LIMIT 1
        `,
        values: [year, department]
      };

      const result = await pool.query(query);

      if (result.rows.length > 0) {
        const externalData = {
          CPIEducation: parseFloat(result.rows[0].CPIEducation) || null,
          InflationRatePast: parseFloat(result.rows[0].InflationRatePast) || null,
          AdmissionRate: parseFloat(result.rows[0].AdmissionRate) || null,
          OverallHFCE: parseFloat(result.rows[0].OverallHFCE) || null,
          HFCEEducation: parseFloat(result.rows[0].HFCEEducation) || null
        };
        res.json(externalData);
      } else {
        res.status(404).json({ message: "No data found for the given school year and department" });
      }
    } catch (err) {
      console.error("Error fetching external data:", err);
      res.status(500).json({ error: "An error occurred while fetching external data" });
    }
  }
);

// Endpoint to process data for prediction
app.post("/api/process-data", 
  [
    body('Start_Year').isInt(),
    body('Semester').isInt(),
    body('Department').isString().trim().escape(),
    body('Major').isString().trim().escape(),
    body('Year_Level').isInt(),
    body('UseExternalData').isBoolean(),
    body('AdmissionRate').optional().isFloat(),
    body('CPIEducation').optional().isFloat(),
    body('OverallHFCE').optional().isFloat(),
    body('HFCEEducation').optional().isFloat(),
    body('InflationRatePast').optional().isFloat(),
  ],
  validate,
  async (req, res) => {
    try {
      const { 
        Start_Year, 
        Semester, 
        Department, 
        Major, 
        Year_Level, 
        UseExternalData,
        AdmissionRate,
        CPIEducation,
        OverallHFCE,
        HFCEEducation,
        InflationRatePast
      } = req.body;

      let query = {
        text: `
          SELECT 
            pd.*,
            CASE WHEN $6 THEN
              COALESCE($7, pd."Number_of_Applicants") AS "Admission_Rate",
              COALESCE($8, pd."CPI_Region3") AS "CPI_Education",
              COALESCE($9, pd."HFCE") AS "Overall_HFCE",
              COALESCE($10, pd."HFCE_Education") AS "HFCE_Education",
              COALESCE($11, pd."Inflation_Rate_lag_1") AS "Inflation_Rate_Past"
            ELSE
              pd."Number_of_Applicants" as "Admission_Rate",
              pd."CPI_Region3" as "CPI_Education",
              pd."HFCE" as "Overall_HFCE",
              pd."HFCE_Education" as "HFCE_Education",
              pd."Inflation_Rate_lag_1" as "Inflation_Rate_Past"
            END
          FROM processed_data pd
          WHERE pd."Start_Year" = $1 AND pd."Semester" = $2 AND pd."Department" = $3 AND pd."Major" = $4
        `,
        values: [
          Start_Year, 
          Semester, 
          Department, 
          Major, 
          Year_Level, 
          UseExternalData,
          AdmissionRate || null,
          CPIEducation || null,
          OverallHFCE || null,
          HFCEEducation || null,
          InflationRatePast || null
        ]
      };

      const result = await pool.query(query);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "No data found for the given parameters" });
      }

      res.json({ status: "success", processed_data: JSON.stringify(result.rows) });
    } catch (err) {
      console.error("Error processing data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});