// pages/api/getUsers.ts

import { NextApiRequest, NextApiResponse } from "next";
import  pool  from "./db"; // Ensure you have your DB connection pool correctly set up

const fetchUsersFromDB = async () => {
  try {
    const client = await pool.connect(); // Connect to PostgreSQL
    const result = await client.query('SELECT * FROM SIJARTA.USER');
    const users = result.rows; // Get users from the query result
    client.release(); // Release client back to pool
    return users; // Return the result as JSON
  } catch (error) {
    console.error("Error fetching users from DB:", error);
    throw new Error("Database error");
  }
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await fetchUsersFromDB(); // Fetch the users
    res.status(200).json(users); // Return the users as JSON
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Database error" });
  }
}
