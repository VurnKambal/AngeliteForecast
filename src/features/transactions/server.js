const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "enrollment_forecasting",
  password: "malabanan",
  port: 5432,
});

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
    let query = "SELECT * FROM enrollment_data";
    const conditions = [];
    const values = [];

    // Check if department parameter is present
    if (department) {
      conditions.push(`department = $${conditions.length + 1}`);
      values.push(department);
    }

    // Check if search parameter is present
    if (search) {
      conditions.push(
        `(major ILIKE $${conditions.length + 1} OR semester ILIKE $${
          conditions.length + 1
        })`
      );
      values.push(`%${search}%`);
    }

    // Check if startYear parameter is present
    if (startYear) {
      conditions.push(`start_year = $${conditions.length + 1}`);
      values.push(parseInt(startYear, 10));
    }

    // Check if endYear parameter is present
    if (endYear) {
      conditions.push(`end_year = $${conditions.length + 1}`);
      values.push(parseInt(endYear, 10));
    }

    // Check if firstYear parameter is present
    if (firstYear) {
      conditions.push(`first_year = $${conditions.length + 1}`);
      values.push(parseInt(firstYear, 10));
    }

    // Check if secondYear parameter is present
    if (secondYear) {
      conditions.push(`second_year = $${conditions.length + 1}`);
      values.push(parseInt(secondYear, 10));
    }

    // Check if thirdYear parameter is present
    if (thirdYear) {
      conditions.push(`third_year = $${conditions.length + 1}`);
      values.push(parseInt(thirdYear, 10));
    }

    // Check if fourthYear parameter is present
    if (fourthYear) {
      conditions.push(`fourth_year = $${conditions.length + 1}`);
      values.push(parseInt(fourthYear, 10));
    }

    // Check if fifthYear parameter is present
    if (fifthYear) {
      conditions.push(`fifth_year = $${conditions.length + 1}`);
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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
