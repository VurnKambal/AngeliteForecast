const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, query, validationResult } = require("express-validator");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
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
// Endpoint for dashboard stats
app.get("/api/dashboard-stats", async (req, res) => {
  try {
    // Create a new pool
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    // Query for enrollment data
    const enrollmentQuery = `
      SELECT "Start_Year", "Semester", SUM("1st_Year" + "2nd_Year" + "3rd_Year" + "4th_Year" + "5th_Year") as total
      FROM enrollment
      WHERE ("Start_Year", "Semester") = (
        SELECT "Start_Year", "Semester"
        FROM enrollment
        ORDER BY "Start_Year" DESC, "Semester" DESC
        LIMIT 1
      )
      GROUP BY "Start_Year", "Semester";
    `;
    const enrollmentResult = await pool.query(enrollmentQuery);

    // Query for inflation rate
    const inflationQuery = `
      SELECT "Start_Year", "Inflation_Rate"
      FROM inflation_rate
      WHERE "Start_Year" = (SELECT MAX("Start_Year") FROM inflation_rate)
      LIMIT 1;
    `;
    const inflationResult = await pool.query(inflationQuery);

    // Query for HFCE
    const hfceQuery = `
      SELECT "Start_Year", "Quarter", "HFCE_Education", "HFCE"
      FROM hfce
      WHERE ("Start_Year", "Quarter") = (
        SELECT "Start_Year", "Quarter"
        FROM hfce
        ORDER BY "Start_Year" DESC, "Quarter" DESC
        LIMIT 1
      );
    `;
    const hfceResult = await pool.query(hfceQuery);

    // Query for CPI
    const cpiQuery = `
      WITH month_mapping AS (
        SELECT "Year", "Month", "CPI_Region3",
          CASE 
            WHEN "Month" = 'Jan' THEN 1
            WHEN "Month" = 'Feb' THEN 2
            WHEN "Month" = 'Mar' THEN 3
            WHEN "Month" = 'Apr' THEN 4
            WHEN "Month" = 'May' THEN 5
            WHEN "Month" = 'Jun' THEN 6
            WHEN "Month" = 'Jul' THEN 7
            WHEN "Month" = 'Aug' THEN 8
            WHEN "Month" = 'Sep' THEN 9
            WHEN "Month" = 'Oct' THEN 10
            WHEN "Month" = 'Nov' THEN 11
            WHEN "Month" = 'Dec' THEN 12
          END AS month_number
      FROM cpi_education
      )
      SELECT "Year", "Month", "CPI_Region3"
      FROM month_mapping
      WHERE ("Year", month_number) = (
        SELECT "Year", MAX(month_number)
        FROM month_mapping
        WHERE "Year" = (SELECT MAX("Year") FROM month_mapping)
        GROUP BY "Year"
      );
    `;
    const cpiResult = await pool.query(cpiQuery);
    const monthMap = {
      'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
      'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
      'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
    };
    cpiResult.rows[0].Month = monthMap[cpiResult.rows[0].Month] || cpiResult.rows[0].Month;

    // Construct the response
    const dashboardStats = {
      enrollment: {
        year: parseInt(enrollmentResult.rows[0].Start_Year),
        semester: enrollmentResult.rows[0].Semester == 1 ? "1st" : "2nd",
        total: parseInt(enrollmentResult.rows[0].total),
      },
      inflation: {
        year: inflationResult.rows[0].Start_Year, // Previous year's inflation
        rate: parseFloat(inflationResult.rows[0].Inflation_Rate),
      },
      hfce: {
        year: hfceResult.rows[0].Start_Year,
        value: parseInt(hfceResult.rows[0].HFCE),
        quarter: ['1st', '2nd', '3rd', '4th'][hfceResult.rows[0].Quarter - 1] + ' Quarter',
      },

      cpi: {
        year: cpiResult.rows[0].Year,
        month: cpiResult.rows[0].Month,
        value: parseFloat(cpiResult.rows[0].CPI_Region3),
        region: "Region 3",
      },
    };

    res.json(dashboardStats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get(
  "/api/transactions",
  [
    query("department").optional().isString().trim().escape(),
    query("search").optional().isString().trim().escape(),
    query("startYear").optional().isInt(),
    query("startYear_1").optional().isInt(),
    query("major").optional().isString().trim().escape(),
    query("firstYear").optional().isInt(),
    query("secondYear").optional().isInt(),
    query("thirdYear").optional().isInt(),
    query("fourthYear").optional().isInt(),
    query("fifthYear").optional().isInt(),
  ],
  validate,
  async (req, res) => {
    try {
      // Extract query parameters
      const {
        search,
        department,
        startYear,
        startYear_1,
        semester,
        major,
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
        const departments = department.split(",");
        const departmentConditions = departments.map((_, index) => `"Department" = $${values.length + index + 1}`);
        conditions.push(`(${departmentConditions.join(" OR ")})`);
        values.push(...departments);
      }

      // Check if search parameter is present
      if (search) {
        conditions.push(
          `("Major" ILIKE $${values.length + 1} OR "Semester" ILIKE $${values.length + 1})`
        );
        values.push(`%${search}%`);
      }

      // Check if startYear parameter is present
      if (startYear) {
        conditions.push(`"Start_Year" >= $${values.length + 1}`);
        values.push(parseInt(startYear, 10));
      }

      // Check if endYear parameter is present
      if (startYear_1) {
        conditions.push(`"Start_Year" <= $${values.length + 1}`);
        values.push(parseInt(startYear_1, 10));
      }

      // Check if semester parameter is present and is an array
      if (semester) {
        const semesters = semester.split(',').map(s => s.trim());
       console.log(semester)
        const placeholders = semesters.map((_, index) => `$${values.length + index + 1}`).join(', ');
        conditions.push(`"Semester" IN (${placeholders})`);
        values.push(...semesters);
      }

      // Check if major parameter is present
      if (major) {
        const majors = major.split(",");
        const majorConditions = majors.map((_, index) => `"Major" = $${values.length + index + 1}`);
        conditions.push(`(${majorConditions.join(" OR ")})`);
        values.push(...majors);
      }

      // Check if firstYear parameter is present
      if (firstYear) {
        conditions.push(`"1st_Year" = $${values.length + 1}`);
        values.push(parseInt(firstYear, 10));
      }

      // Check if secondYear parameter is present
      if (secondYear) {
        conditions.push(`"2nd_Year" = $${values.length + 1}`);
        values.push(parseInt(secondYear, 10));
      }

      // Check if thirdYear parameter is present
      if (thirdYear) {
        conditions.push(`"3rd_Year" = $${values.length + 1}`);
        values.push(parseInt(thirdYear, 10));
      }

      // Check if fourthYear parameter is present
      if (fourthYear) {
        conditions.push(`"4th_Year" = $${values.length + 1}`);
        values.push(parseInt(fourthYear, 10));
      }

      // Check if fifthYear parameter is present
      if (fifthYear) {
        conditions.push(`"5th_Year" = $${values.length + 1}`);
        values.push(parseInt(fifthYear, 10));
      }

      // Append conditions to the query if any
      if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
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
  }
);

app.get("/api/transactions/lowest-enrollment-year", async (req, res) => {
  try {
    const query = {
      text: `
        SELECT MIN("Start_Year") as lowest_year
        FROM enrollment
      `,
    };

    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.json({ lowestYear: result.rows[0].lowest_year });
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/transactions/departments", async (req, res) => {
  try {
    const query = {
      text: `SELECT DISTINCT "Department" FROM enrollment
      WHERE "Department" NOT IN ('GS', 'JHS', 'HAUSPELL', 'HAU', 'MA')
      ORDER BY "Department" ASC`,
    };
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/transactions/majors", async (req, res) => {
  try {
    const { department } = req.query;

    if (!department) {
      return res.status(400).json({ error: "Department is required" });
    }

    const departments = department.split(",");
    const departmentConditions = departments.map((_, index) => `"Department" = $${index + 1}`);
    const query = {
      text: `
        SELECT DISTINCT "Major", "Department" FROM enrollment WHERE ${departmentConditions.join(" OR ")} ORDER BY "Major" ASC
      `,
      values: departments,
    };

    const result = await pool.query(query);
    console.log(result, "resulttttt");
    res.json(result.rows);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/transactions/processed-data", async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM processed_data
      ORDER BY "Start_Year" DESC, "Department" ASC
    `;
    
    const result = await pool.query(query);
    
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ error: "No processed data found" });
    }
  } catch (err) {
    console.error("Error fetching processed data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(
  "/api/transactions/update",
  [
    body("Start_Year").isInt(),
    body("End_Year").isInt(),
    body("Semester").isInt(),
    body("Department").isString().trim().escape(),
    body("Major").isString().trim().escape(),
    body("1st_Year").isInt(),
    body("2nd_Year").isInt(),
    body("3rd_Year").isInt(),
    body("4th_Year").isInt(),
    body("5th_Year").isInt(),
  ],
  validate,
  async (req, res) => {
    try {
      const {
        Start_Year,
        End_Year,
        Semester,
        Department,
        Major,
        "1st_Year": firstYear,
        "2nd_Year": secondYear,
        "3rd_Year": thirdYear,
        "4th_Year": fourthYear,
        "5th_Year": fifthYear,
      } = req.body;

      const query = {
        text: `
          INSERT INTO enrollment ("Start_Year", "End_Year", "Semester", "Department", "Major", "1st_Year", "2nd_Year", "3rd_Year", "4th_Year", "5th_Year")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT ("Start_Year", "End_Year", "Semester", "Department", "Major")
          DO UPDATE SET
            "1st_Year" = EXCLUDED."1st_Year",
            "2nd_Year" = EXCLUDED."2nd_Year",
            "3rd_Year" = EXCLUDED."3rd_Year",
            "4th_Year" = EXCLUDED."4th_Year",
            "5th_Year" = EXCLUDED."5th_Year"
        `,
        values: [Start_Year, End_Year, Semester, Department, Major, firstYear, secondYear, thirdYear, fourthYear, fifthYear],
      };

      await pool.query(query);

      res.status(200).json({ message: 'Data updated successfully' });
    } catch (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'An error occurred while updating the data' });
    }
  }
);


app.get("/api/departments", async (req, res) => {
  try {
    const query = {
      text: 'SELECT DISTINCT "Department" FROM processed_factors ORDER BY "Department"',
    };
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to fetch majors based on department
app.get(
  "/api/majors",
  [query("department").isString().trim().escape()],
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
        values: [department],
      };

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Registration endpoint
app.post(
  "/api/register",
  [
    body("name").isString().trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
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
        values: [name],
      };
      const usernameCheck = await pool.query(usernameQuery);
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Check if email already exists
      const emailQuery = {
        text: "SELECT * FROM users WHERE email = $1",
        values: [email],
      };
      const emailCheck = await pool.query(emailQuery);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = {
        text: "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
        values: [name, email, hashedPassword],
      };
      const result = await pool.query(insertQuery);
      res.status(201).json({ userId: result.rows[0].id });
    } catch (err) {
      console.error("Error occurred:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get(
  "/api/leads",
  [
    query("department").optional().isString().trim().escape(),
    query("search").optional().isString().trim().escape(),
  ],
  validate,
  async (req, res) => {
    const { department, search } = req.query;
    try {
      let query = `
        SELECT DISTINCT
          "Start_Year",
          "Department",
          "Number_of_Applicants",
          ROUND(CAST("CPI_Region3" AS NUMERIC), 2) AS "CPI_Region3",
          ROUND(CAST("HFCE_Education" AS NUMERIC), 2) AS "HFCE_Education",
          ROUND(CAST("HFCE" AS NUMERIC), 2) AS "Overall_HFCE",
          ROUND(CAST("Inflation_Rate_lag_1" AS NUMERIC), 2) as "Inflation_Rate_Past"
        FROM processed_factors
        WHERE "Start_Year" >= 2018
        ${department ? 'AND "Department" = $1' : ""}
        ${search ? `
          AND (
            "Department" ILIKE $2 OR
            "CPI_Region3"::TEXT ILIKE $2 OR
            "HFCE_Education"::TEXT ILIKE $2 OR
            "HFCE"::TEXT ILIKE $2 OR
            "Inflation_Rate_lag_1"::TEXT ILIKE $2
          )
        ` : ""}
        ORDER BY "Start_Year" ASC, "Department" ASC
      `;


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
app.post(
  "/api/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const emailQuery = {
        text: "SELECT * FROM users WHERE email = $1",
        values: [email],
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
app.get("/api/latest-data-year", async (req, res) => {
  try {
    const latestYearQuery = {
      text: `
        SELECT MAX("Start_Year") as latest_year
        FROM processed_factors
      `,
    };

    const result = await pool.query(latestYearQuery);

    if (result.rows.length > 0) {
      res.json({ latestYear: result.rows[0].latest_year });
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to fetch external data based on school year and department
app.get(
  "/api/external-data",
  [query("schoolYear").isInt(), query("department").isString().trim().escape()],
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
          FROM processed_factors
          WHERE "Start_Year" = $1 AND "Department" = $2
          LIMIT 1
        `,
        values: [year, department],
      };

      const result = await pool.query(query);

      if (result.rows.length > 0) {
        const externalData = {
          CPIEducation: parseFloat(result.rows[0].CPIEducation) || null,
          InflationRatePast:
            parseFloat(result.rows[0].InflationRatePast) || null,
          AdmissionRate: parseFloat(result.rows[0].AdmissionRate) || null,
          OverallHFCE: parseFloat(result.rows[0].OverallHFCE) || null,
          HFCEEducation: parseFloat(result.rows[0].HFCEEducation) || null,
        };
        res.json(externalData);
      } else {
        res.status(404).json({
          message: "No data found for the given school year and department",
        });
      }
    } catch (err) {
      console.error("Error fetching external data:", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching external data" });
    }
  }
);

// Endpoint to process data for prediction
app.post(
  "/api/process-data",
  [
    body("Start_Year").isInt(),
    body("Semester").isInt(),
    body("Department").isString().trim().escape(),
    body("Major").isString().trim().escape(),
    body("Year_Level").isInt(),
    body("UseExternalData").isBoolean(),
    body("AdmissionRate").optional().isFloat(),
    body("CPIEducation").optional().isFloat(),
    body("OverallHFCE").optional().isFloat(),
    body("HFCEEducation").optional().isFloat(),
    body("InflationRatePast").optional().isFloat(),
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
        InflationRatePast,
      } = req.body;

      let query = {
        text: `
          SELECT 
            pf.*,
            CASE WHEN $6 THEN
              COALESCE($7, pf."Number_of_Applicants") AS "Admission_Rate",
              COALESCE($8, pf."CPI_Region3") AS "CPI_Education",
              COALESCE($9, pf."HFCE") AS "Overall_HFCE",
              COALESCE($10, pf."HFCE_Education") AS "HFCE_Education",
              COALESCE($11, pf."Inflation_Rate_lag_1") AS "Inflation_Rate_Past"
            ELSE
              pf."Number_of_Applicants" as "Admission_Rate",
              pf."CPI_Region3" as "CPI_Education",
              pf."HFCE" as "Overall_HFCE",
              pf."HFCE_Education" as "HFCE_Education",
              pf."Inflation_Rate_lag_1" as "Inflation_Rate_Past"
            END
          FROM processed_factors pf
          WHERE pf."Start_Year" = $1 AND pf."Semester" = $2 AND pf."Department" = $3 AND pf."Major" = $4
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
          InflationRatePast || null,
        ],
      };

      const result = await pool.query(query);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No data found for the given parameters" });
      }

      res.json({
        status: "success",
        processed_factors: JSON.stringify(result.rows),
      });
    } catch (err) {
      console.error("Error processing data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
