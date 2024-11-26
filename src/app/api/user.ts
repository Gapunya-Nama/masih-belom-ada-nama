import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";

// Function to fetch users from the database
const fetchUsersFromDB = async () => {
  try {
    const client = await pool.connect(); // Connect to PostgreSQL
    const result = await client.query("SELECT * FROM SIJARTA.USER"); // Modify based on your table structure
    const users = result.rows; // Get users from the query result
    client.release(); // Release the client back to the pool
    return users; // Return the result
  } catch (error) {
    console.error("Error fetching users from DB:", error);
    throw new Error("Database error");
  }
};

// API handler to return users as JSON
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await fetchUsersFromDB(); // Fetch the users
    res.status(200).json(users); // Return the users as JSON
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Database error" });
  }
}
