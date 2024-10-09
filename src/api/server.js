const express = require("express");
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, query, validationResult } = require("express-validator");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const zxcvbn = require('zxcvbn');
const { parse } = require('csv-parse');

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

// JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY
};

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const userQuery = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [jwt_payload.id],
    };
    const result = await pool.query(userQuery);
    if (result.rows.length > 0) {
      return done(null, result.rows[0]);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

// Initialize Passport
app.use(passport.initialize());

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



app.get("/api/dashboard-selected-stats", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // + 1 JavaScript months are 0-indexed


    var { selectedYear, selectedSemester, selectedDepartment } = req.query;
    
    if (!selectedYear || !selectedSemester) {
      return res.status(400).json({ error: "Year and semester are required" });
    }

    
    selectedYear = parseInt(selectedYear);
    selectedSemester = parseInt(selectedSemester);

    if (selectedSemester === 2) {
      enrollmentYear = selectedYear
      enrollmentSemester = 1;
    } else if (selectedSemester === 1) {
      enrollmentYear = selectedYear - 1
      enrollmentSemester = 2;
    }


    // Query for applicants
    let applicantsQuery;
    let applicantsQueryParams;
    
    
    if (selectedDepartment) {
      applicantsQuery = `
        SELECT SUM("Number_of_Applicants") as total_applicants
          FROM admission
          WHERE "Start_Year" = $1 
            AND "Department" = $2;
      `;
      applicantsQueryParams = [selectedYear, selectedDepartment];
    } else {
      const departmentsQuery = `
        SELECT DISTINCT "Department"
          FROM processed_factors
          ORDER BY "Department";
      `;
      const departments = await pool.query(departmentsQuery);

      applicantsQuery = `
        SELECT SUM("Number_of_Applicants") as total_applicants
          FROM admission
          WHERE "Start_Year" = $1
            AND "Department" IN (${departments.rows.map(dept => `'${dept.Department}'`).join(', ')});
      `;
      applicantsQueryParams = [selectedYear];
    }


    const admissionResult = await pool.query(applicantsQuery, applicantsQueryParams);


    
    // Query for enrollment data based on year and semester
    const enrollmentQuery = `
      SELECT "Start_Year", "Semester", SUM("1st_Year" + "2nd_Year" + "3rd_Year" + "4th_Year" + "5th_Year") as total
      FROM enrollment
      WHERE "Start_Year" = $1 AND "Semester" = $2
      GROUP BY "Start_Year", "Semester";
    `;

    const enrollmentResult = await pool.query(enrollmentQuery, [enrollmentYear, enrollmentSemester]);


    
    // Query for inflation rate from the past year based on the given year
    const inflationQuery = `
      SELECT "Start_Year", "Inflation_Rate"
      FROM inflation_rate
      WHERE "Start_Year" = $1 - 1
      LIMIT 1;
    `;
    const inflationResult = await pool.query(inflationQuery, [selectedYear]);
    // Query for HFCE
    const hfceQuery = `
      SELECT 
        "Start_Year", 
        AVG("HFCE_Education") as "HFCE_Education", 
        AVG("HFCE") as "HFCE"
      FROM hfce
      WHERE "Start_Year" = $1
      GROUP BY "Start_Year"
    `;
    const hfceResult = await pool.query(hfceQuery, [selectedYear]);
    

    // Modify your CPI query to use cpiEndMonth
    const cpiQuery = `
      WITH cpi_data AS (
        SELECT "Year", "Month", "CPI_Region3"
        FROM cpi_education
        WHERE "Month" != 'Ave' AND "Year" = $1
      )
      SELECT 
        "Year",
        ROUND(AVG("CPI_Region3")::numeric, 2) AS "Average_CPI_Region3"
      FROM cpi_data
      GROUP BY "Year"
    `;

    const cpiResult = await pool.query(cpiQuery, [selectedYear]);

    

    console.log(inflationResult.rows[0])
    // Construct the response
    const dashboardStats = {
      admission: {
        year: selectedYear,
        department: selectedDepartment || 'HAU',
        number_of_applicants: parseInt(admissionResult.rows[0].total_applicants),
      },
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
        quarter: `1st-${['1st', '2nd', '3rd', '4th'][hfceResult.rows[0].max_quarter - 1]} Quarter Average`,
      },

      cpi: {
        year: selectedYear,
        value: parseFloat(cpiResult.rows[0].Average_CPI_Region3),
        region: "Region 3",
      },
    };

    res.json(dashboardStats);
    } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
    }
  }
);



app.get(
  "/api/transactions",
  [
    query("department").optional().isString().trim().escape(),
    query("search").optional().isString().trim().escape(),
    query("startYear").optional().isInt(),
    query("startYear_1").optional().isInt(),
    query("major").optional().isString().trim().escape(),
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
      } = req.query;

      // Start with the base query
      let query = `
      SELECT * FROM enrollment
      WHERE "Department" NOT IN ('GS', 'JHS', 'HAUSPELL', 'HAU', 'MA')
      `;
      const conditions = [];
      const values = [];

      // // Check if department parameter is present
      if (department) {
        const departments = department.split(",");
        const departmentConditions = departments.map((_, index) => `"Department" = $${values.length + index + 1}`);
        conditions.push(`(${departmentConditions.join(" OR ")})`);
        values.push(...departments);
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

      // Append conditions to the query if any
      if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
      }

      query += ` ORDER BY "Start_Year" DESC, "Department" ASC, "Major" ASC`;
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



// Add this function to create a unique constraint if it doesn't exist
async function ensureUniqueConstraint() {
  try {
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'enrollment_unique_constraint'
        ) THEN
          ALTER TABLE enrollment 
          ADD CONSTRAINT enrollment_unique_constraint 
          UNIQUE ("Start_Year", "Semester", "Department", "Major");
        END IF;
      END $$;
    `);
    console.log("Unique constraint checked/created successfully");
  } catch (err) {
    console.error("Error ensuring unique constraint:", err);
  }
}

// Call this function when your server starts
ensureUniqueConstraint();
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

app.post("/api/transactions/update", upload.single('csvFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(parser)
    .on('data', (data) => {
      console.log("Raw CSV row:", data);  // Log raw data
      results.push(data);
    })
    .on('end', async () => {
      try {
        const validRows = results.filter(row => {
          console.log("Filtering row:", row);  // Log each row being filtered
          const criticalFields = ['Major', 'Department', 'Semester', 'Start_Year'];
          return criticalFields.every(field => {
            console.log(`Checking ${field}:`, row.Major);
            if (field === 'Start_Year' || field === 'Semester') {
              return row[field] && row[field] !== '' && !isNaN(row[field]);
            } else {
              return row[field] && row[field] !== '';
            }
          });
        });
        console.log("Valid rows:", validRows);

        for (const row of validRows) {
          const columns = [
            "Start_Year", "Semester", "Department", "Major",
            "1st_Year", "2nd_Year", "3rd_Year", "4th_Year", "5th_Year",
            "Grade_1", "Grade_2", "Grade_3", "Grade_4", "Grade_5", "Grade_6",
            "Grade_7", "Grade_8", "Grade_9", "Grade_10", "Grade_11", "Grade_12", "TOTAL"
          ];
        
          const values = columns.map(col => {
            if (col === "Start_Year" || col === "Semester") {
              return parseInt(row[col]) || 0;
            } else if (col === "Department" || col === "Major") {
              return row[col] || '';
            } else {
              const value = parseInt(row[col]);
              return isNaN(value) ? 0 : value;
            }
          });
        
          const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
          const updateSet = columns.slice(4).map(col => `"${col}" = EXCLUDED."${col}"`).join(', ');
        
          const query = {
            text: `
              INSERT INTO enrollment ("${columns.join('", "')}")
              VALUES (${placeholders})
              ON CONFLICT ("Start_Year", "Semester", "Department", "Major")
              DO UPDATE SET
                ${updateSet}
            `,
            values: values,
          };
        
          try {
            console.log("Executing query:", query);
            await pool.query(query);
          } catch (err) {
            console.error('Error inserting/updating row:', err);
            console.error('Problematic row:', row);
            continue;
          }
        }

        const droppedRows = results.length - validRows.length;
        res.status(200).json({ 
          message: 'Data updated successfully',
          rowsProcessed: validRows.length,
          rowsDropped: droppedRows
        });
      } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).json({ error: 'An error occurred while updating the data' });
      } finally {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting temporary file:', unlinkErr);
          }
        });
      }
    });
});


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
    body("email").isEmail().normalizeEmail().custom(value => {
      if (!value.endsWith('hau.edu.ph')) {
        throw new Error('Email must be a valid HAU email address');
      }
      return true;
    }),
    body("password").custom((value, { req }) => {
      const result = zxcvbn(value);
      if (result.score < 3) {
        throw new Error('Password is too weak. Please choose a stronger password.');
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      // Start a transaction
      await pool.query('BEGIN');

      // Check if username already exists
      const usernameQuery = {
        text: "SELECT * FROM users WHERE username = $1",
        values: [name],
      };
      const usernameCheck = await pool.query(usernameQuery);
      if (usernameCheck.rows.length > 0) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: "Username already exists" });
      }

      // Check if email already exists
      const emailQuery = {
        text: "SELECT * FROM users WHERE email = $1",
        values: [email],
      };
      const emailCheck = await pool.query(emailQuery);
      if (emailCheck.rows.length > 0) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = {
        text: "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
        values: [name, email, hashedPassword],
      };
      const result = await pool.query(insertQuery);
      const userId = result.rows[0].id;

      // Insert user role
      const insertRoleQuery = {
        text: "INSERT INTO user_roles (user_id, role_id) VALUES ($1, (SELECT id FROM roles WHERE name = 'User'))",
        values: [userId],
      };
      await pool.query(insertRoleQuery);

      // Commit the transaction
      await pool.query('COMMIT');

      const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1d' });
      res.status(201).json({ token });
    } catch (err) {
      await pool.query('ROLLBACK');
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
    query("start_year").optional().isInt(),
    query("end_year").optional().isInt(),
  ],
  validate,
  async (req, res) => {
    const { department, search, start_year, end_year } = req.query;
    try {
      let conditions = [];
      let values = [start_year, end_year];
      let paramCounter = 2;

      // Base query
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
        WHERE "Start_Year" >= $1 AND "Start_Year" <= $2
      `;
      // Handle multiple departments
      if (department) {
        const departments = department.split(",");
        const departmentConditions = departments.map((_, index) => {
          paramCounter++;
          return `"Department" = $${paramCounter}`;
        });
        conditions.push(`(${departmentConditions.join(" OR ")})`);
        values.push(...departments);
      }

      // Handle search
      if (search) {
        paramCounter++;
        conditions.push(`(
          "Department" ILIKE $${paramCounter} OR
          "CPI_Region3"::TEXT ILIKE $${paramCounter} OR
          "HFCE_Education"::TEXT ILIKE $${paramCounter} OR
          "HFCE"::TEXT ILIKE $${paramCounter} OR
          "Inflation_Rate_lag_1"::TEXT ILIKE $${paramCounter}
        )`);
        values.push(`%${search}%`);
      }

      // Add conditions to query
      if (conditions.length > 0) {
        query += ` AND ${conditions.join(" AND ")}`;
      }

      // Add ordering
      query += ` ORDER BY "Start_Year" DESC, "Department" ASC`;

      console.log("Executing query:", query);
      console.log("With values:", values);

      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (err) {
      console.error("Error executing query", err.stack);
      res.status(500).send("Server error");
    }
  }
);

app.get('/api/leads/lowest-year',
  async (req, res) => {
    try {
      const result = await pool.query('SELECT MIN("Start_Year") as lowest_year FROM processed_factors');
      if (result.rows.length > 0 && result.rows[0].lowest_year) {
        res.json({ lowestYear: result.rows[0].lowest_year });
      } else {
        res.status(404).json({ error: 'No data found' });
      }
    } catch (error) {
      console.error('Error fetching lowest year:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);



// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };
    const result = await pool.query(userQuery);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (isMatch) {
        // Check if it's the first login
        const isFirstLogin = user.login_counter === 0;

        // Increment the login counter
        const updateLoginCounterQuery = {
          text: "UPDATE users SET login_counter = login_counter + 1 WHERE id = $1",
          values: [user.id],
        };
        await pool.query(updateLoginCounterQuery);

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1d' });
        return res.json({ 
          token,
          isFirstLogin,
          message: isFirstLogin ? 'Please change your password for security reasons.' : null
        });
      }
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Change password endpoint
app.post('/api/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { newPassword } = req.body;
  try {
    const user = req.user;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatePasswordQuery = {
      text: "UPDATE users SET password_hash = $1 WHERE id = $2",
      values: [hashedPassword, user.id],
    };
    await pool.query(updatePasswordQuery);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Protected route example
app.get('/api/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'You accessed a protected route!', user: req.user });
});

// Check role API
app.get("/api/check-role", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedToken = jwt.verify(token, SECRET_KEY);
      const userId = decodedToken.id;
      const roleQuery = {
        text: "SELECT roles.name as role FROM user_roles INNER JOIN roles ON user_roles.role_id = roles.id WHERE user_roles.user_id = $1",
        values: [userId],
      };
      const result = await pool.query(roleQuery);
      if (result.rows.length > 0) {
        res.json({ role: result.rows[0].role });
      } else {
        res.status(404).json({ error: "No role found" });
      }
    } catch (error) {
      console.error("Invalid token:", error);
      res.status(401).json({ error: "Invalid token. Please login again." });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


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

// New route to get the latest data year
app.get("/api/enrollment/latest-data-year", async (req, res) => {
  try {
    const latestYearQuery = {
      text: `
        SELECT MAX("Start_Year") as latest_year
        FROM enrollment
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

// Add this new endpoint near your other API routes
app.get("/api/latest-school-year-semester", async (req, res) => {
  try {
    const query = `
      WITH latest_year AS (
                SELECT MAX("Start_Year") AS max_year
                FROM processed_factors
            )
            SELECT ly.max_year AS "Start_Year", 
                   COALESCE(MAX(e."Semester"), 1) AS "Semester"
            FROM latest_year ly
            LEFT JOIN enrollment e ON e."Start_Year" = ly.max_year
            GROUP BY ly.max_year
            LIMIT 1
    `;

    const result = await pool.query(query);

    if (result.rows.length > 0) {
      const { Start_Year, Semester } = result.rows[0];
      res.json({
        latestYear: Start_Year,
        latestSemester: Semester
      });
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (err) {
    console.error("Error fetching latest school year and semester:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});